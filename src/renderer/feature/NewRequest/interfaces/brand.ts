import { Brand } from '@dilecy/model/serverModel';
import { IdMap } from '@dilecy/store/util/types';

export interface BrandsResponse {
  brandsList: Brand[];
  byId: IdMap<Brand>;
  pageNumber: number;
  hasMore: boolean;
  totalCount: number;
}
