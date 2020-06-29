import { Brand } from '../../../model/serverModel';
import { IdMap } from '../../../store/util/types';

export interface BrandsResponse {
  brandsList: Brand[];
  byId: IdMap<Brand>;
  pageNumber: number;
  hasMore: boolean;
  totalCount: number;
}
