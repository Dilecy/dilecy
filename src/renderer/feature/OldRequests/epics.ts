import { Epic } from '../../store/root-epic';
import { filter, concatMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import * as Actions from './actions';
import { fromThunky } from '../../store/thunky';
import { IdMap } from '@dilecy/store';
import { Brand, Company, RequestGroup } from '@dilecy/model';
import { localization } from '@dilecy/shared';

export const fetchOldRequestsEpic: Epic = (
  action$,
  state$,
  { clientBackend, apiService }
) =>
  action$.pipe(
    filter(isActionOf(Actions.oldRequestsRequested)),
    concatMap(() =>
      fromThunky(async dispatch => {
        try {
          const state = state$.value;
          const oldRequestsState = state.oldRequestsState;
          dispatch(Actions.oldRequestsLoadingStarted());
          let oldRequests: RequestGroup[] = [];
          if (oldRequestsState.byId.length) {
            oldRequests = oldRequestsState.byId.map(
              id => oldRequestsState.oldRequests[id]
            );
          } else {
            oldRequests = await clientBackend.getRequestGroups();
          }

          // check if there are any requests with empty brandnames
          const requestsWithEmptyBrandNames = oldRequests.filter(
            request => !request.brandName
          );
          const brandIdsWithNoName = requestsWithEmptyBrandNames.map(
            request => request.brandId
          );

          if (brandIdsWithNoName.length) {
            // fetch brand information from server
            const brandsFromServer = await apiService.getBrandsByIds({
              ids: brandIdsWithNoName
            });

            const missingCompanyIds = brandsFromServer.map(
              brand => brand.company
            );

            // fetch company information from server
            const missingCompanies: Company[] = [];
            for (const key in missingCompanyIds) {
              const company = await apiService.getCompany(
                missingCompanyIds[key]
              );
              missingCompanies.push(company);
            }
            // store companies as IdMap
            let companiesFromServerMap: IdMap<Company> = {};
            const initalCompaniesFromServerMap: IdMap<Company> = {};
            companiesFromServerMap = missingCompanies.reduce((prev, next) => {
              if (!prev[next.id]) {
                prev[next.id] = next;
              }
              return prev;
            }, initalCompaniesFromServerMap);

            // store brands as as IdMap
            let brandsFromServerMap: IdMap<Brand> = {};
            const initalBrandsFromServerMap: IdMap<Brand> = {};
            brandsFromServerMap = brandsFromServer.reduce((prev, next) => {
              if (!prev[next.id]) {
                prev[next.id] = next;
              }
              return prev;
            }, initalBrandsFromServerMap);

            // map requests with correct brand names and company names
            const updatedOldRequests = requestsWithEmptyBrandNames.map(
              request => {
                //check if brand exists
                const retreivedBrand = brandsFromServerMap[request.brandId];
                const retrievedCompany = retreivedBrand
                  ? companiesFromServerMap[retreivedBrand.company]
                  : undefined;

                const retreivedCompanyName =
                  retreivedBrand && retrievedCompany
                    ? retrievedCompany.name
                    : localization.UNKNOWN;

                return {
                  ...request,
                  companyName: retreivedCompanyName,
                  brandName: retreivedBrand
                    ? retreivedBrand.name
                    : localization.UNKNOWN
                };
              }
            );
            const oldRequestsWithUpdatedBrandName = oldRequests
              .filter(request => !!request.brandName)
              .concat(updatedOldRequests);

            //sync the updated old requests in local database
            for (const request in updatedOldRequests) {
              await clientBackend.updateRequestGroup(
                updatedOldRequests[request]
              );
            }
            dispatch(
              Actions.oldRequestsReceived(oldRequestsWithUpdatedBrandName)
            );
          } else {
            dispatch(Actions.oldRequestsReceived(oldRequests));
          }
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(Actions.oldRequestsLoadingFinished());
        }
      })
    )
  );

export const updateRequestGroupEpic: Epic = (
  action$,
  state$,
  { clientBackend }
) =>
  action$.pipe(
    filter(isActionOf(Actions.updateRequestGroup)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const requestGroupToUpdate = action.payload;
        await clientBackend.updateRequestGroup(requestGroupToUpdate);
      })
    )
  );
