import { API_CONFIG } from './api-config';
import { ApiService } from './api-interface';
import {
  ConsentAction,
  MissingBrand,
  Tag,
  Brand
} from '../../model/serverModel';
import {
  getRequest,
  getRequestPaginated,
  postRequest,
  postJSON,
  postAll,
  fetchAll,
  patchJSON
} from './http-service';

const createBrandsUrl = (apiBaseUrl: string) => (autocompleteText?: string) => (
  tagIds?: number[]
): string => {
  let tagParams = '';
  if (tagIds && tagIds.length) {
    tagParams = tagIds.map(tagId => `&tags=${tagId}`).join('');
  }
  let autocompleteParam = '';
  if (autocompleteText && autocompleteText.trim().length) {
    autocompleteParam = `&autocomplete=${autocompleteText.trim()}`;
    return `${apiBaseUrl}/${API_CONFIG.brands}/search?${autocompleteParam}${tagParams}`;
  }
  return `${apiBaseUrl}/${API_CONFIG.brands}?${tagParams}`;
};

/**
 * Generates an API service and return an object with all API methods
 * @param apiBaseUrl
 */
export const createApiService = (apiBaseUrl: string): ApiService => ({
  checkForUpdate: (version: string) =>
    getRequest(`${apiBaseUrl}/update?version=${version}`),
  getBrands: (
    pageNumber: number,
    autocompleteText?: string,
    tagIds?: number[]
  ) =>
    getRequestPaginated(
      createBrandsUrl(apiBaseUrl)(autocompleteText)(tagIds),
      pageNumber
    ),
  getBrandsByIds: (body: { ids: number[] }) =>
    postAll<Brand, any>(`${apiBaseUrl}/brands`, body).toPromise(),
  getAuthority: (id: number) => getRequest(`${apiBaseUrl}/authorities/${id}`),
  getCompany: (id: number) => getRequest(`${apiBaseUrl}/companies/${id}`),
  getDpo: (id: number) =>
    getRequest(`${apiBaseUrl}/data_protection_officers/${id}`),
  getAuthQuestions: (pageNumber: number) =>
    getRequestPaginated(`${apiBaseUrl}/authentication_questions`, pageNumber),
  getDomains: () => fetchAll(`${apiBaseUrl}/domains`),
  // getDomains: (pageNumber: number) =>
  //   getRequestPaginated(`${apiBaseUrl}/domains`, pageNumber),
  getBrandRelations: (pageNumber: number) =>
    getRequestPaginated(`${apiBaseUrl}/brand_relations`, pageNumber),
  getEmailTemplates: (pageNumber: number) =>
    getRequestPaginated(`${apiBaseUrl}/email_templates`, pageNumber),
  getTags: () => fetchAll<Tag>(`${apiBaseUrl}/tags`).toPromise<Tag[]>(),
  postConsent: (consent: ConsentAction) =>
    postRequest(`${apiBaseUrl}/consents`, consent),
  postMissingBrand: (missingBrand: MissingBrand) =>
    postRequest(`${apiBaseUrl}/suggested_brands`, missingBrand),
  postPing: (cohort: string, is_first: boolean) =>
    postRequest(`${apiBaseUrl}/ping?cohort=${cohort}&is_first=${is_first}`, {}),
  postRating: (points: number) => postJSON(`${apiBaseUrl}/ratings`, { points }),
  patchRating: (points: number, id: number, password: string) =>
    patchJSON(`${apiBaseUrl}/ratings/${id}?password=${password}`, { points }),
  postFeedback: (message: string) =>
    postRequest(`${apiBaseUrl}/feedback`, { message })
});
