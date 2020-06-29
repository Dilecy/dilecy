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
  brandId!: number;
  brandName!: string;
  companyName!: string;
  requestGroupType!: RequestGroupType;
  dateTimeCreated!: string;
  dateTimeRefreshed!: string;
  dateTimeSnoozed?: string;
  state!: RequestGroupState;
  dataStatus!: RequestGroupDataStatus;
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
