import { ConsentAction, MissingBrand } from '@dilecy/model';
import { ApiService } from './api-interface';
import { serverTestData } from '../../model/mock/testData';
import { of } from 'rxjs';

const postConsent = (consent: ConsentAction) =>
  new Promise(() => {
    throw new Error('Server Error');
  });

const postMissingBrand = (brand: MissingBrand) =>
  new Promise(() => {
    throw new Error('Server Error');
  });
export function createMockApiService(): ApiService {
  return {
    checkForUpdate: async () => new Promise(() => ({})),
    getAuthority: async (id: number) => serverTestData.authorities[id],
    getAuthQuestions: () => new Promise(() => serverTestData.authQuestions),
    getBrands: () => new Promise(() => serverTestData.brands),
    getBrandsByIds: () => new Promise(() => serverTestData.brands),
    getDomains: () =>
      of([
        { fqdn: 'www.github.com', brand: 697 },
        { fqdn: 'www.google.com', brand: 1351 }
      ]),
    getBrandRelations: () => new Promise(() => serverTestData.brandRelations),
    getCompany: async (id: number) => serverTestData.companies[id],
    getDpo: async (id: number) => serverTestData.dpos[id],
    getEmailTemplates: () => new Promise(() => serverTestData.emailTemplates),
    getTags: () => new Promise(() => serverTestData.tags),
    postConsent: (consent: ConsentAction) => postConsent(consent),
    postMissingBrand: (brand: MissingBrand) => postMissingBrand(brand),
    postPing: (cohort: string, is_first: boolean) => new Promise(() => true),
    postRating: (points: number) =>
      new Promise(() => ({
        points,
        id: 1,
        password: 'password'
      })),
    patchRating: (points: number, id: number, password: string) =>
      new Promise(() => ({
        points,
        id,
        password
      })),
    postFeedback: (message: string) => new Promise(() => ({}))
  };
}
