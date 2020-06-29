import { AjaxResponse } from 'rxjs/ajax';
import { PaginatedResponse } from './api-service';
import {
  Brand,
  Company,
  Authority,
  DataProtectionOfficer,
  AuthenticationQuestion,
  Tag,
  EmailTemplate,
  BrandRelation,
  ConsentAction,
  MissingBrand,
  UpdateInfo,
  Domain,
  RatingResponse
} from '../../model/serverModel';
import { Observable } from 'rxjs';

export interface ApiService {
  checkForUpdate: (version: string) => Promise<UpdateInfo>;
  getBrands: (
    pageNumber: number,
    autocompleteText?: string,
    tagIds?: number[]
  ) => Promise<PaginatedResponse<Brand[]>>;
  getBrandsByIds: (body: { ids: number[] }) => Promise<Brand[]>;
  getAuthority: (id: number) => Promise<Authority>;
  getCompany: (id: number) => Promise<Company>;
  getDpo: (id: number) => Promise<DataProtectionOfficer>;
  getAuthQuestions: (
    pageNumber: number
  ) => Promise<PaginatedResponse<AuthenticationQuestion[]>>;
  // getDomains: (pageNumber: number) => Promise<PaginatedResponse<Domain[]>>;
  getDomains: () => Observable<Domain[]>;
  getBrandRelations: (
    pageNumber: number
  ) => Promise<PaginatedResponse<BrandRelation[]>>;
  getEmailTemplates: (
    pageNumber: number
  ) => Promise<PaginatedResponse<EmailTemplate[]>>;
  getTags: () => Promise<Tag[]>;
  postConsent: (consent: ConsentAction) => Promise<AjaxResponse | unknown>;
  postMissingBrand: (
    missingBrand: MissingBrand
  ) => Promise<AjaxResponse | unknown>;
  postPing: (
    cohort: string,
    is_first: boolean
  ) => Promise<AjaxResponse | unknown>;
  postRating: (points: number) => Promise<RatingResponse>;
  patchRating: (
    points: number,
    id: number,
    password: string
  ) => Promise<RatingResponse>;
  postFeedback: (message: string) => Promise<AjaxResponse | unknown>;
}
