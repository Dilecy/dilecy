/* eslint-disable @typescript-eslint/camelcase */
import { createSelector } from 'reselect';
import { RootState } from 'typesafe-actions';
import * as SM from '@dilecy/model';
import { HashMap, IdMap } from '../util/types';
import { BrowserHistory } from 'node-browser-history';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

export interface BrowserHistoryWithBrand extends BrowserHistory {
  brandId: number | undefined;
  last_accessed?: string;
  tableData?: { id: number; checked: boolean };
  selected?: boolean;
}

const getSelectSearchFilter = (state: RootState) =>
  state.newRequestState.selectSearchFilter;

const getTagFilter = (state: RootState) => state.newRequestState.tagFilter;
const getBrandSelection = (state: RootState) =>
  state.newRequestState.brandSelection;

const selectBrands = (state: RootState) => {
  const brands =
    state.newRequestState.brands.paginatedBrands.brandsByPageNumber;
  return Object.keys(brands).reduce(
    (r, k) => {
      return r.concat(brands[(k as unknown) as number]);
    },
    [] as SM.Brand[]
  );
};

export const selectTags = (state: RootState) => state.newRequestState.tags;
export const selectDomains = (state: RootState) => state.serverData.domain;
export const selectBrowserHistory = (state: RootState) =>
  state.newRequestState.browserHistory;

export const tagGenerator = (tagIds: number[], tags: IdMap<SM.Tag>) => {
  const tagNames = tagIds.map(tagId => tags[tagId].name);
  return tagNames.join(', ');
};

function* filterIdMap<T>(map: IdMap<T>, filter: (v: T) => boolean) {
  for (const v in map) if (filter(map[v])) yield map[v];
}

function applyBrandSearchFilter(
  brands: IdMap<SM.Brand>,
  searchFilter: string
): SM.Brand[] {
  const filter = (b: SM.Brand) => new RegExp(searchFilter, 'i').test(b.name);
  return Array.from(filterIdMap(brands, filter));
}

export const getFilteredBrandList = createSelector(
  selectBrands,
  getSelectSearchFilter,
  getTagFilter,
  selectTags,
  (brands, searchFilter, tagFilter, tags) => {
    try {
      let filteredBrands = applyBrandSearchFilter(brands, searchFilter);
      if (tagFilter.length > 0) {
        filteredBrands = filteredBrands.filter(brand =>
          brand.tags.find(tag => tagFilter.find(t => t === tag) !== undefined)
        );
      }
      const sortedBrands = filteredBrands.sort((b1, b2) =>
        b1.name.localeCompare(b2.name)
      );
      const filteredBrandsWithFormattedTags = sortedBrands.map(brand => ({
        ...brand,
        formattedTags: tagGenerator(brand.tags, tags)
      }));
      return filteredBrandsWithFormattedTags;
    } catch (error) {
      //TODO set error marker
      return [];
    }
  }
);

const hostNameMatcher = (
  hostName: string,
  domainList: HashMap<SM.Domain>
): number | undefined => {
  let matchedBrandId: number | undefined = undefined;
  if (Object.prototype.hasOwnProperty.call(domainList, hostName)) {
    //match found
    matchedBrandId = domainList[hostName].brand;
    return matchedBrandId;
  } else {
    //split hostname
    const splitHostName = hostName.split('.');
    if (splitHostName.length > 1) {
      //remove sub-domain
      splitHostName.shift();
      return hostNameMatcher(splitHostName.join('.'), domainList);
    }
  }
  return matchedBrandId;
};

export const getRecommendedDomainsWithBrands = createSelector(
  selectDomains,
  selectBrowserHistory,
  getBrandSelection,
  (domains, browserHistory, brandSelection) => {
    const selectedBrands = Object.keys(brandSelection).map(k => parseInt(k));
    const browserHistoryWithBrand = browserHistory.browserHistoryData.map(
      data => {
        const hostName = new URL(data.url).hostname;
        const matchedBrandId = hostNameMatcher(hostName, domains);
        const checked = !!(
          matchedBrandId && selectedBrands.indexOf(matchedBrandId) > -1
        );
        const browserHistoryWithBrand: BrowserHistoryWithBrand = {
          ...data,
          brandId: matchedBrandId,
          url: hostName,
          selected: checked,
          // Material table adds this tableData part, and row
          // selection is based on this. Checked has to be
          // included here.
          tableData: {
            id: 0, // MaterialTable will update this
            checked
          }
        };
        return browserHistoryWithBrand;
      }
    );
    // modified utc time to readable time duration
    // and remove undefined brandIds
    return Object.values(browserHistoryWithBrand
      .filter(item => item.brandId !== undefined)
      .reduce(
        (acc, curr) => Object.assign(acc, { [curr.brandId || '']: curr }),
        {}
      ) as BrowserHistoryWithBrand[]).map(item => ({
      ...item,
      last_accessed: moment(item.utc_time).format('DD.MM.YYYY')
    }));
  }
);
