import {
  MProfile,
  MProfileDetails,
  MEmailRequest,
  MRequestGroup,
  MConsentAction,
  MAppData
} from './enitities';
import * as CM from '../clientModel';
import { ConsentAction } from '../serverModel';
import { ConsentStatus } from '../clientModel';
import { DatabaseFactory } from './database';
import Knex = require('knex');
import { SealedPassword } from '../../core/crypto/interface';
import { getDbCreatedDate } from './migrations';
import { MigrationError } from './migrations/types';

export class DBClientBackend implements CM.ClientBackend {
  db: DatabaseFactory;
  metaDb?: Knex;
  profileDb?: Knex;

  constructor(dbFolder: string) {
    this.db = new DatabaseFactory(dbFolder);
  }

  async createProfile(
    sealedPassword: SealedPassword,
    encryptionKey: string,
    _profileDetails: CM.ProfileCreate
  ) {
    const passwordHash = await sealedPassword.hashPassword();
    const profile = await MProfile.query(this.metaDb).insertAndFetch({
      profileName: _profileDetails.profileName,
      passwordHash,
      encryptionKey: await sealedPassword.encrypt(encryptionKey)
    });
    this.profileDb = await this.db.connectToProfileDb(profile, encryptionKey);
    const profileDetails = await MProfileDetails.query(
      this.profileDb
    ).insertAndFetch(_profileDetails);
    return { profile, profileDetails };
  }

  async getProfiles() {
    this.metaDb = await this.db.connectToMetaDb();
    return await MProfile.query(this.metaDb);
  }

  async getProfileCreatedDate() {
    this.metaDb = await this.db.connectToMetaDb();
    return await getDbCreatedDate(this.metaDb);
  }

  async getProfileDetails(profile: CM.Profile, sealedPassword: SealedPassword) {
    const key = await sealedPassword.decrypt(profile.encryptionKey);
    this.profileDb = await this.db.connectToProfileDb(profile, key);
    const data = await MProfileDetails.query(this.profileDb).first();
    return data;
  }

  async deleteProfile(profile: CM.Profile) {
    await MProfile.query(this.metaDb).deleteById(profile.id);

    if (this.profileDb) {
      await this.profileDb.destroy();
      //delete the profile db file
      await this.db.deleteProfileDb(profile);
    }
  }

  async updateProfile(
    profile: CM.Profile,
    profileDetails: Partial<CM.ProfileDetails>
  ) {
    //Password changes are handled separately
    const p = await MProfile.query(this.metaDb).patchAndFetchById(profile.id, {
      profileName: profile.profileName
    });
    const oldPd = await MProfileDetails.query(this.profileDb).first();
    const pd = await oldPd.$query(this.profileDb).patchAndFetch(profileDetails);
    return {
      profile: p,
      profileDetails: pd
    };
  }

  async changeProfilePassword(
    profile: CM.Profile,
    oldPassword: SealedPassword,
    newPassword: SealedPassword
  ) {
    if (!this.metaDb || !this.profileDb)
      throw new Error(
        'Change password cannot be called before connected to databases'
      );
    const p = await MProfile.query(this.metaDb)
      .where('id', profile.id)
      .first();
    if (!p) throw new Error('Cannot read profile from database');

    const pd = await MProfileDetails.query(this.profileDb).first();
    if (!pd)
      throw new Error('Cannot read profile details from profile database.');

    const key = await oldPassword.decrypt(p.encryptionKey);
    // eslint-disable-next-line require-atomic-updates
    p.encryptionKey = await newPassword.encrypt(key);
    // eslint-disable-next-line require-atomic-updates
    p.passwordHash = await newPassword.hashPassword();
    for (const a of pd.emailAccounts) {
      const ep = await oldPassword.decrypt(a.encyptedPassword);
      a.encyptedPassword = await newPassword.encrypt(ep);
    }

    try {
      await MProfile.transaction(this.metaDb, async pTrx => {
        await MProfile.query(pTrx)
          .update(p)
          .where('id', p.id);
        await MProfileDetails.query(this.profileDb)
          .update(pd)
          .where('id', pd.id);
      });
    } catch (error) {
      throw new Error('Unable to execute password change.');
    }

    return {
      profile: p,
      profileDetails: pd
    };
  }

  async getConsentStatus() {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const ret: ConsentStatus = { tracking: undefined, ux_research: undefined };
    for (const purpose in ret) {
      try {
        const researchConsent = await MConsentAction.query(this.profileDb)
          .where('purpose', purpose)
          .orderBy('dateTime', 'DESC')
          .first();
        ret[purpose as keyof ConsentStatus] =
          researchConsent.action === 'given' ? researchConsent.data : undefined;
      } catch (error) {
        // console.log(error);
      }
    }
    return ret;
  }

  async getTrackingId() {
    const trackingConsent = await MConsentAction.query(this.profileDb)
      .where('purpose', 'tracking')
      .where('action', 'given')
      .orderBy('dateTime', 'DESC')
      .first();

    if (trackingConsent && trackingConsent.data) {
      return trackingConsent.data;
    }
  }

  async storeConsentActions(actions: ConsentAction[]) {
    for (const action of actions) {
      if (action.purpose === 'tracking') {
        action.data = (await this.getTrackingId()) || action.data;
      }
      await MConsentAction.query(this.profileDb).insert(action);
    }
  }

  async getRequestGroups() {
    // @ts-ignore: MRequestGroup has a constructor with parameters which objection
    // does not support.
    return MRequestGroup.query(this.profileDb);
  }
  async updateRequestGroup(group: CM.RequestGroup) {
    // @ts-ignore: see getRequestGroups comment
    await MRequestGroup.query(this.profileDb)
      .update(group)
      .where('id', group.id);
  }
  async createRequestGroup(group: Partial<CM.RequestGroup>) {
    // @ts-ignore: see getRequestGroups comment
    return MRequestGroup.query(this.profileDb).insertAndFetch(group);
  }

  async getEmailRequests() {
    return MEmailRequest.query(this.profileDb);
  }
  async updateEmailRequest(request: CM.EmailRequest) {
    await MEmailRequest.query(this.profileDb)
      .update(request)
      .where('id', request.id);
  }
  async createEmailRequest(request: Partial<CM.EmailRequest>) {
    return MEmailRequest.query(this.profileDb).insertAndFetch(request);
  }

  async checkDbCompatibility(
    profile?: CM.Profile,
    sealedPassword?: SealedPassword
  ) {
    try {
      if (profile && sealedPassword) {
        const key = await sealedPassword.decrypt(profile.encryptionKey);
        await this.db.connectToProfileDb(profile, key);
      } else {
        await this.db.connectToMetaDb();
      }
    } catch (e) {
      if (e instanceof MigrationError) {
        return false;
      } else {
        console.error('Unexpected DB issue', e);
        return Promise.reject();
      }
    }
    return true;
  }

  async getAppData() {
    this.metaDb = await this.db.connectToMetaDb();
    return await MAppData.query(this.metaDb);
  }

  async insertAppData(appData: CM.AppData) {
    this.metaDb = await this.db.connectToMetaDb();
    return await MAppData.query(this.metaDb).insertAndFetch(appData);
  }
}
