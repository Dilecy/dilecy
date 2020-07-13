/* eslint-disable @typescript-eslint/camelcase */
import * as CM from '../clientModel';
import { testProfile, testProfileDetails } from './testData';

export function createInMemoryClientBackend(): CM.ClientBackend {
  let profileStore: CM.Profile[] = [testProfile];
  const profileDetailStore: CM.ProfileDetails[] = [testProfileDetails];
  const requestGroupsStore: CM.RequestGroup[] = [
    {
      brandId: 1,
      brandName: 'Facebook',
      companyName: 'Facebook',
      dateTimeCreated: '2020-05-11T15:52:06.190Z',
      snoozeCount: 0,
      id: 1,
      requestGroupType: 'access',
      state: 'inProgress'
    },
    {
      brandId: 2,
      brandName: 'Nike',
      companyName: 'Nike',
      dateTimeCreated: '2019-03-15T15:56:06.190Z',
      snoozeCount: 0,
      id: 2,
      requestGroupType: 'access',
      state: 'inProgress'
    },
    {
      brandId: 3,
      brandName: 'Gmail',
      companyName: 'Google',
      dateTimeCreated: '2020-04-08T15:52:06.190Z',
      snoozeCount: 0,
      id: 3,
      requestGroupType: 'access',
      state: 'inProgress'
    },
    {
      brandId: 99839454354359,
      brandName: '',
      companyName: '',
      dateTimeCreated: '2020-02-11T15:52:06.190Z',
      snoozeCount: 0,
      id: 4,
      requestGroupType: 'access',
      state: 'inProgress'
    },
    {
      brandId: 173,
      brandName: '',
      companyName: '',
      dateTimeCreated: '2020-05-08T15:52:06.190Z',
      snoozeCount: 0,
      id: 5,
      requestGroupType: 'access',
      state: 'inProgress'
    }
  ];
  const emailRequestsStore: CM.EmailRequest[] = [];
  const consentStatus: CM.ConsentStatus = {
    tracking: 'abcd1234asdf1234',
    ux_research: testProfileDetails.emailAccounts[0].emailAddress
  };
  // const authentificationAnswersStore: CM.AuthenticationAnswer[] = [];

  const createProfile: CM.CreateProfile = async (
    sealedPassword,
    encryptionKey,
    _profileDetails
  ) => {
    const profile = {
      id: profileStore.length,
      profileName: _profileDetails.profileName,
      passwordHash: await sealedPassword.hashPassword(),
      encryptionKey: await sealedPassword.encrypt(encryptionKey)
    };
    profileStore.push(profile);
    const profileDetails = {
      ..._profileDetails,
      id: profileDetailStore.length,
      firstName: '',
      lastName: '',
      city: '',
      dateOfBirth: '',
      state: '',
      country: '',
      streetName: '',
      houseNumber: '',
      zipCode: '',
      emailAccounts: []
    };
    profileDetailStore.push(profileDetails);
    return { profile, profileDetails };
  };

  const getProfiles: CM.GetProfiles = async () => {
    return profileStore;
  };

  const getProfileDetails: CM.GetProfileDetails = async profile =>
    profileDetailStore[profile.id];

  const getProfileCreatedDate: CM.GetProfileCreatedDate = async () =>
    new Date().toString();

  const updateProfile: CM.UpdateProfile = async (profile, profileDetails) => {
    profileStore[profile.id] = profile;
    Object.assign(profileDetailStore[profile.id], profileDetails);
    return {
      profile: profileStore[profile.id],
      profileDetails: profileDetailStore[profile.id]
    };
  };

  const deleteProfile: CM.DeleteProfile = async profileToDelete => {
    profileStore = profileStore.filter(
      profile => profile.id !== profileToDelete.id
    );
  };

  const changeProfilePassword: CM.ChangeProfilePassword = async (
    profile,
    oldPassword,
    newPassword
  ) => {
    const p = { ...profileStore[profile.id] };
    const pd = { ...profileDetailStore[profile.id] };
    const key = await oldPassword.decrypt(p.encryptionKey);
    p.encryptionKey = await newPassword.encrypt(key);
    p.passwordHash = await newPassword.hashPassword();
    for (const a of pd.emailAccounts) {
      const ep = await oldPassword.decrypt(a.encyptedPassword);
      a.encyptedPassword = await newPassword.encrypt(ep);
    }
    // eslint-disable-next-line require-atomic-updates
    profileStore[profile.id] = p;
    // eslint-disable-next-line require-atomic-updates
    profileDetailStore[profile.id] = pd;
    return {
      profile: p,
      profileDetails: pd
    };
  };

  const getRequestGroups: CM.GetRequestGroups = async () => requestGroupsStore;
  const updateRequestGroup: CM.UpdateRequestGroup = async group => {
    const index = requestGroupsStore.findIndex(
      requestGroup => requestGroup.id === group.id
    );
    requestGroupsStore[index] = group;
  };

  const createRequestGroup: CM.CreateRequestGroup = async group => {
    const base: CM.RequestGroup = {
      id: requestGroupsStore.length,
      brandId: -1,
      brandName: 'test brand',
      companyName: 'test company',
      requestGroupType: 'access',
      dateTimeCreated: Date.now().toString(),
      snoozeCount: 0,
      state: 'inProgress'
    };
    const newGroup: CM.RequestGroup = {
      ...base,
      ...group
    };
    requestGroupsStore.push(newGroup);
    return newGroup;
  };
  const getEmailRequests: CM.GetEmailRequests = async () => emailRequestsStore;
  const updateEmailRequest: CM.UpdateEmailRequest = async request => {
    emailRequestsStore.push(request);
  };
  const createEmailRequest: CM.CreateEmailRequest = async request => {
    const base: CM.EmailRequest = {
      id: emailRequestsStore.length,
      requestGroupId: -1,
      requestType: 'data',
      inCreation: true,
      from: '',
      to: '',
      subject: '',
      text: ''
    };
    const newRequest: CM.EmailRequest = {
      ...base,
      ...request
    };
    emailRequestsStore.push(newRequest);
    return newRequest;
  };

  const storeConsentActions: CM.StoreConsentActions = async actions => {
    actions.forEach(action => {
      consentStatus[action.purpose] =
        action.action === 'given' ? action.data : undefined;
    });
  };

  const getConsentStatus: CM.GetConsentStatus = async () => consentStatus;

  const getTrackingId: CM.GetTrackingId = async () => 'abc123';

  // const getAuthentificationAnswers: CM.GetAuthenticationAnswers = async () =>
  //   authentificationAnswersStore;
  // const storeAuthentificationAnswers: CM.StoreAuthenticationAnswers = async answers => {
  //   authentificationAnswersStore.push(...answers);
  // };

  const checkDbCompatibility: CM.CheckDbCompatibility = async () => true;

  const getAppData: CM.GetAppData = async () => [] as CM.AppData[];

  const insertAppData: CM.InsertAppData = async appData => appData;

  return {
    getProfiles,
    getProfileDetails,
    createProfile,
    updateProfile,
    deleteProfile,
    changeProfilePassword,
    getRequestGroups,
    updateRequestGroup,
    createRequestGroup,
    getEmailRequests,
    updateEmailRequest,
    createEmailRequest,
    getConsentStatus,
    getTrackingId,
    storeConsentActions,
    getProfileCreatedDate,
    checkDbCompatibility,
    getAppData,
    insertAppData
    // getAuthentificationAnswers,
    // storeAuthentificationAnswers
  };
}
