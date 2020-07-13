import { Model } from 'objection';
import {
  Profile,
  ProfileDetails,
  EmailAccount,
  RequestGroup,
  EmailRequest,
  RequestGroupType,
  RequestGroupState,
  RequestGroupDataStatus,
  RequestType,
  AppData
} from '../clientModel';
import { ConsentAction } from '../serverModel';
import * as Schema from './schemas';
import { localization } from '../../shared/localization';
import {
  DUE_DAY_DURATION,
  PROGRESS_COMPLETED
} from '../../shared/utils/environment';
import { differenceInDays, addDays } from 'date-fns';

export class MProfile extends Model implements Profile {
  static get tableName() {
    return 'profiles';
  }
  profileName!: string;
  passwordHash!: string;
  encryptionKey!: string;
  id!: number;
}

export class MProfileDetails extends Model implements ProfileDetails {
  static get tableName() {
    return 'profile_details';
  }
  id!: number;
  profileName!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;
  streetName!: string;
  houseNumber!: string;
  zipCode!: string;
  city!: string;
  state!: string;
  country!: string;
  emailAccounts!: EmailAccount[];
  lastLogin?: string;
  rating?: number;
  ratingId?: number;
  ratingPassword?: string;

  static get jsonSchema() {
    return Schema.profileDetailsSchema;
  }
}

export class MRequestGroup extends Model implements RequestGroup {
  static get tableName() {
    return 'request_groups';
  }
  id!: number;

  constructor(
    public brandId: number,
    public brandName: string,
    public companyName: string,
    public requestGroupType: RequestGroupType,
    public dateTimeCreated: string,
    public snoozeCount: number,
    public state: RequestGroupState
  ) {
    super();
  }

  get createdDate() {
    return new Date(this.dateTimeCreated);
  }

  get dueDate() {
    return addDays(
      new Date(this.dateTimeCreated),
      DUE_DAY_DURATION * (this.snoozeCount + 1)
    );
  }

  get isDue() {
    const currentDate = new Date();
    if (differenceInDays(this.dueDate, currentDate) <= 0) return true;
    return false;
  }

  get visibleState() {
    if (this.state === 'failed') return localization.VISIBLE_STATE_FAILED;
    else if (this.state === 'successful')
      return localization.VISIBLE_STATE_SUCCESSFUL;
    else {
      if (this.isDue) return localization.VISIBLE_STATE_DUE;
      else if (this.snoozeCount === 0)
        return localization.VISIBLE_STATE_RUNNING;
      else return localization.VISIBLE_STATE_SNOOZED;
    }
  }

  get progress() {
    if (this.isDue) return PROGRESS_COMPLETED;
    const daysPast =
      Math.abs(differenceInDays(new Date(this.dateTimeCreated), new Date())) +
      1; //including current date
    const duration = differenceInDays(this.dueDate, this.createdDate);
    const progress = (daysPast / duration) * PROGRESS_COMPLETED;
    return Math.floor(progress);
  }
}

export class MEmailRequest extends Model implements EmailRequest {
  static get tableName() {
    return 'email_requests';
  }
  id!: number;
  requestGroupId!: number;
  requestType!: RequestType;
  inCreation!: boolean;
  dateTimeSent?: string;
  messageId?: string;
  from!: string;
  to!: string;
  subject!: string;
  text!: string;
}

export class MConsentAction extends Model implements ConsentAction {
  static get tableName() {
    return 'consent';
  }
  id!: number;
  dateTime!: string;
  purpose!: 'ux_research' | 'tracking';
  action!: 'given' | 'revoked';
  data!: string;
}

export class MAppData extends Model implements AppData {
  static get tableName() {
    return 'app_info';
  }
  version!: string;
}
