import { RequestGroupType } from '../../model/clientModel';
import { IdMap } from '../../store/util/types';

export const getTranslatedRequestGroupType = (
  requestGroupType: RequestGroupType
) => {
  switch (requestGroupType) {
    case 'access':
      return 'Datenauskunft';
    case 'deletion':
      return 'Datenlöschung';
    case 'rejection':
      return 'Widerspruch';
    default:
      return '';
  }
};

export const isEmptyMap = (item: IdMap<any>) => {
  return Object.keys(item).length === 0 && item.constructor === Object;
};
