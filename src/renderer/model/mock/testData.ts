/* eslint-disable @typescript-eslint/camelcase */
import * as CM from '../clientModel';
import * as SM from '../serverModel';
import { IdMap } from '../../store/util/types';

export const testProfile: CM.Profile = {
  id: 0,
  profileName: 'Test (password is test)',
  passwordHash: 'test',
  encryptionKey: 'secret'
};

const testEmail: CM.EmailAccount = {
  emailAddress: 'test@dilecy.de',
  isPrimary: true,
  smtp: 'smtp.dilecy.de',
  smtpPort: 587,
  smtpUser: 'test',
  encyptedPassword: 'secret',
  isGoogle: true
};

export const testProfileDetails: CM.ProfileDetails = {
  id: 0,
  profileName: 'Test',
  firstName: 'Max',
  lastName: 'Mustermann',
  dateOfBirth: '1980-01-01',
  streetName: 'Street',
  houseNumber: '1',
  zipCode: '12345',
  city: 'Stadt',
  state: 'Bundesland',
  country: 'Deutschland',
  emailAccounts: [testEmail]
};

function createRequestGroup(
  id: number,
  brandId: number,
  brandName: string,
  companyName: string,
  requestGroupType: CM.RequestGroupType,
  dateTimeCreated: string,
  snoozeCount: number,
  state: CM.RequestGroupState
): CM.RequestGroup {
  return {
    id,
    brandId,
    brandName,
    companyName,
    requestGroupType,
    dateTimeCreated,
    snoozeCount,
    state
  };
}

const authQuestions: SM.AuthenticationQuestion[] = [];
const authorities: IdMap<SM.Authority> = {};
const brands: SM.Brand[] = [];
const domains: SM.Domain[] = [];
const brandRelations: SM.BrandRelation[] = [];
const companies: IdMap<SM.Company> = {};
const dpos: IdMap<SM.DataProtectionOfficer> = {};
const emailTemplates: SM.EmailTemplate[] = [];
const tags: SM.Tag[] = [
  {
    id: 1,
    is_active: true,
    is_suggestion: false,
    name: 'Versicherung',
    description: ''
  },
  {
    id: 2,
    is_active: true,
    is_suggestion: false,
    name: 'Reisen',
    description: ''
  },
  {
    id: 3,
    is_active: true,
    is_suggestion: false,
    name: 'Unterhaltung',
    description: ''
  }
];

const mockDomainsNames = [
  'google.com',
  'facebook.com',
  'github.com',
  'medium.com',
  'youtube.com',
  'amazon.com'
];

mockDomainsNames.map((domainName, index) =>
  domains.push({
    brand: index + 1,
    fqdn: domainName
  })
);

const idProvider = () => {
  let nextId = 0;
  return {
    next: () => {
      nextId += 1;
      return nextId;
    }
  };
};
const companyId = idProvider();
const dpoId = idProvider();

emailTemplates.push({
  id: 1,
  type: 'data_access',
  text: `To
  {{ company.name }}
  {{ company.address1 }}
  {{ company.address2 }}
  {{ company.zip }}
  {{ company.city }}
  {{ company.country }}
  Dear Sir or Madame
    {{ profile.firstname }}
    {{ profile.lastname }}
    {{ profile.date_of_birth }}
    {{ profile.street }}
    {{ profile.house_number }}
    {{ profile.zip }}
    {{ profile.city }}
    {{ profile.state }}
    {{ profile.country }}',`,
  subject: 'Gimme my data'
});

const commonAuthQ: SM.AuthenticationQuestion = {
  id: 1,
  category: 'general',
  answer_type: 'text',
  description: 'Common Auth Question',
  question: 'Whats up?'
};
authQuestions.push(commonAuthQ);
// const letters = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const letters = Array.from('ABCDEF');

letters.forEach(c => {
  const newCompany: SM.Company = {
    id: companyId.next(),
    name: `Company ${c}`,
    address_1: 'Addres1',
    address_2: 'Addres2',
    zip_code: '12345',
    city: 'City',
    country: 'country'
  };
  companies[newCompany.id] = newCompany;
  const companyAuthQ: SM.AuthenticationQuestion = {
    id: authQuestions.length + 1,
    category: 'general',
    answer_type: 'text',
    description: `${newCompany.name} Auth Q`,
    question: `${newCompany.name} id`
  };
  authQuestions.push(companyAuthQ);

  letters.forEach((cc, ii) => {
    const dpo: SM.DataProtectionOfficer = {
      id: dpoId.next(),
      name: `Dpo ${c}${cc}`,
      email: `fabian.hundertmark@posteo.de`,
      language: 'german'
    };
    dpos[dpo.id] = dpo;
    const brandAuthQ: SM.AuthenticationQuestion = {
      id: authQuestions.length + 1,
      category: 'general',
      answer_type: 'text',
      description: `${cc} Auth Q`,
      question: `Brand ${cc} userName`
    };
    authQuestions.push(brandAuthQ);

    const brand: SM.Brand = {
      id: brands.length + 1,
      company: newCompany.id,
      name: `${newCompany.name}'s Brand ${cc}`,
      is_active: true,
      authentication_questions: [1, companyAuthQ.id, brandAuthQ.id],
      data_protection_officer: dpo.id,
      tags: [1, 2]
    };

    if (ii % 2 === 1) {
      const brandRelation: SM.BrandRelation = {
        id: brandRelations.length + 1,
        brand_a: brand.id,
        brand_b: brand.id - 1,
        direction: ii % 4 === 1 ? 'two_way' : 'one_way'
      };
      brandRelations.push(brandRelation);
    }
    brands.push(brand);
  });
});

export const serverTestData = {
  authQuestions,
  authorities,
  brands,
  domains,
  brandRelations,
  companies,
  dpos,
  emailTemplates,
  tags
};

export const requestGroups = [
  createRequestGroup(1, 0, 'test', 'test', 'access', 'DATE_A', 0, 'inProgress'),
  createRequestGroup(2, 1, 'test', 'test', 'access', 'DATE_A', 0, 'failed')
];

export const requestGroupMap = {
  1: createRequestGroup(
    1,
    0,
    'test',
    'test',
    'access',
    'DATE_A',
    0,
    'inProgress'
  ),
  2: createRequestGroup(2, 1, 'test', 'test', 'access', 'DATE_A', 0, 'failed')
};
