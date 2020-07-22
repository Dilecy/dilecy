/* eslint-disable @typescript-eslint/camelcase */
export interface Tag {
  id: number;
  is_active?: boolean;
  is_suggestion?: boolean;
  name: string;
  description?: string;
}

export interface Company {
  id: number;
  name: string;
  address_1: string;
  address_2: string;
  zip_code: string;
  city: string;
  country: string;
}
export const language = {
  german: 'German',
  english: 'English'
};
export type Language = keyof typeof language;
export interface DataProtectionOfficer {
  id: number;
  name: string;
  email: string;
  language: Language;
}

export const authenticationQuestionCategory = {
  general: 'General'
};
export type AuthenticationQuestionCategory = keyof typeof authenticationQuestionCategory;
export const authenticationAnswerType = {
  text: 'Text',
  file: 'File'
};
export type AuthenticationAnswerType = keyof typeof authenticationAnswerType;

export interface AuthenticationQuestion {
  id: number;
  category: AuthenticationQuestionCategory;
  question: string;
  description: string;
  answer_type: AuthenticationAnswerType;
}

export interface Brand {
  id: number;
  is_active: boolean;
  name: string;
  company: number; //=> Company
  data_protection_officer: number; //=> DPO
  authentication_questions: number[]; //=> AuthenticationQuestion[]
  tags: number[]; //=> Tag[]
  formattedTags?: string;
}

export interface Domain {
  fqdn: string; // fqdn = Fully Qualified Domain Name
  brand: number;
}

export interface MissingBrand {
  name: string;
  company_name: string;
  address_1: string;
  address_2: string;
  zip_code: string;
  city: string;
  website_url: string;
  data_protection_officer_email: string;
}

export interface BrandRelation {
  id: number;
  brand_a: number; //=> Brand
  brand_b: number; //=> Brand
  direction: 'one_way' | 'two_way';
}

export const federalStates = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen'
};
export type FederalState = keyof typeof federalStates;

export interface Authority {
  id: number;
  name: string;
  email: string;
  federal_state: FederalState;
}

export const emailType = {
  // Data
  data_access: 'Access',
  data_deletion: 'Deletion',
  data_rejection: 'Rejection',
  data_portability: 'Portability',
  // Reminder
  reminder_access: 'Access',
  reminder_deletion: 'Deletion',
  reminder_rejection: 'Rejection',
  reminder_portability: 'Portability',
  // Complain
  complain: 'Complain at authority'
};
export type EmailType = keyof typeof emailType;
export interface EmailTemplate {
  id: number;
  type: EmailType;
  subject: string;
  text: string;
}

export type UpdateInfo = {
  message: string;
  latest_version: string;
  url_windows: string;
  url_macos: string;
  url_linux: string;
};

export interface ConsentAction {
  purpose: 'ux_research' | 'tracking';
  action: 'given' | 'revoked';
  data: string;
}

export interface RatingResponse {
  id: number;
  points: number;
  password: string;
}

// export interface ServerBackend {
//   checkForUpdate: (version: string) => Promise<Partial<UpdateInfo>>;
//   getAuthority: (id: number) => Promise<Authority>;
//   getAuthQuestions: () => Observable<AuthenticationQuestion[]>;
//   getBrands: () => Promise<Brand[]>;
//   getDomains: () => Observable<Domain[]>;
//   getBrandRelations: () => Observable<BrandRelation[]>;
//   getCompany: (id: number) => Promise<Company>;
//   getDpo: (id: number) => Promise<DataProtectionOfficer>;
//   getEmailTemplates: () => Observable<EmailTemplate[]>;
//   getTags: () => Observable<Tag[]>;
//   postConsent: (consent: ConsentAction) => Promise<void>;
//   postMissingBrand: (brand: MissingBrand) => Promise<void>;
// }
