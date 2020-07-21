import { filter, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {
  addMissingBrand,
  startFetchingBrowserHistory,
  setBrowserHistory,
  stopFetchingBrowserHistory,
  newRequestDone,
  confirmAndSend,
  setRecipientStatus,
  newRequestSent,
  selectRequestType,
  setRequestTemplateText,
  setRequestSubject,
  emailTemplatesRequested,
  emailTemplatesReceived,
  emailTemplatesRequestFailed,
  brandsRequested,
  brandsRequestFailed,
  brandsReceived,
  tagsRequested,
  tagsReceived,
  tagsRequestFailed,
  setSelectSearchFilter,
  brandsCleared,
  setBrandTagFilter,
  recommendedBrandsRequested,
  recommendedBrandsRequestFailed,
  recommendedBrandsReceived,
  resetBrowserHistory,
  newRequestStartSubmission,
  newRequestSubmissionSuccess,
  newRequestSubmissionError
} from './actions';
import { fromThunky } from '../../store/thunky';
import { pushAlert, selectPage, addRequestGroups } from '../../core/actions';
import { from, Subscription } from 'rxjs';
import {
  getRecipientsWithStatus,
  getOriginalRequestTemplate
} from './selectors';
import {
  replaceProfileInfo,
  replaceCompanyInfo,
  clearTemplateFields
} from '../../store/util/templateFields';
import { addEmailRequests } from '../OldRequests/actions';
import { Epic } from '../../store/root-epic';
import { HashMap, IdMap } from '../../store/util/types';
import { EmailTemplate, Brand, Tag } from '../../model/serverModel';
import { tagGenerator } from '../../store/selectors/newRequest';
import { MessageTransport } from '../../core/mailer/interface';
import { isEmptyMap } from '../../shared/helpers/helper';
import { HISTORY_IMPORT_LIMIT } from '@dilecy/shared';
import { Tracker } from '../../core/tracker/interface';
import { createTaskQueue } from '../../core/google/callQueue';
/* eslint-disable @typescript-eslint/camelcase */
import { gmail_v1 } from 'googleapis/build/src/apis/gmail/v1';
import { googleAuth } from '../../core/google/googleAuth';

const loadingHistoryFailed =
  'Der Browserverlauf konnte nicht geladen werden. Bitte wende dich an unseren Support.';

const trackRequests = (state: any, tracker: Tracker, eventType: string) => {
  const { recipientStatus, requestType } = state.newRequestState;
  if (recipientStatus && requestType) {
    const keys = Object.keys(recipientStatus);
    const sentCount = keys
      .map(id => recipientStatus[parseInt(id)])
      .filter(s => s === 'sent').length;

    tracker.event('new request', 'sent', requestType, sentCount);
    tracker.event('new request', eventType, requestType);
  }
};

export const addMissingBrandEpic: Epic = (action$, _, { apiService }) =>
  action$.pipe(
    filter(isActionOf(addMissingBrand)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const missingBrand = action.payload;
        try {
          await apiService.postMissingBrand(missingBrand);
          dispatch(pushAlert('Marke erfolgreich eingereicht'));
        } catch (error) {
          dispatch(pushAlert(error.message));
        }
      })
    )
  );

export const browserHistoryEpic: Epic = (action$, state$, { browserHistory }) =>
  action$.pipe(
    filter(isActionOf(startFetchingBrowserHistory)),
    concatMap(() =>
      fromThunky(async dispatch => {
        const state = state$.value;
        const period = state.newRequestState.browserHistory.period;
        //fetching browser history.
        try {
          const browserHistoryData = await browserHistory(period);
          //order by descending date and dispatch latest 10000 browser history data
          browserHistoryData.sort((a, b) => b.utc_time - a.utc_time);
          dispatch(
            setBrowserHistory(browserHistoryData.slice(0, HISTORY_IMPORT_LIMIT))
          );
        } catch (error) {
          console.log(error);
          dispatch(pushAlert(loadingHistoryFailed));
          dispatch(resetBrowserHistory());
        }
        dispatch(stopFetchingBrowserHistory());
      })
    )
  );

export const newRequestDoneEpic: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(newRequestDone)),
    concatMap(() =>
      fromThunky(async dispatch => {
        //The reducer resets newRequestState to initial values
        dispatch(selectPage({ newRequest: 'choose' }));
      })
    )
  );

export const confirmAndSendEpic: Epic = (
  action$,
  state$,
  { clientBackend, apiService, mailer, loginSystem, tracker }
) =>
  action$.pipe(
    filter(isActionOf(confirmAndSend)),
    concatMap(() =>
      fromThunky(async (dispatch, defer) => {
        const state = state$.value;
        let taskQueueSubscription: Subscription | null = null;
        if (!state.loginStatus.loggedIn) return;
        dispatch(newRequestStartSubmission());
        try {
          const profileDetails = state.loginStatus.loggedIn.profileDetails;
          let transport: MessageTransport | undefined;
          const taskQueue = createTaskQueue();
          taskQueueSubscription = taskQueue.init(500).subscribe();

          const {
            emailAddress,
            smtp,
            smtpUser,
            smtpPort,
            encyptedPassword,
            isGoogle,
            refreshToken,
            isForwarder
          } = profileDetails.emailAccounts[0];
          if (isGoogle) {
            const decryptedToken = await loginSystem.sealedPassword.decrypt(
              refreshToken!
            );

            const authClient = await googleAuth.getAuthClient(decryptedToken);

            const apiClient = new gmail_v1.Gmail({
              auth: authClient
            });

            transport = mailer.getGoogleTransport(taskQueue, apiClient);
          } else if (isForwarder) {
            transport = mailer.getForwarderTransport(taskQueue, profileDetails);
          } else {
            transport = mailer.getSmtpTransport(
              smtp,
              smtpPort,
              smtpUser,
              await loginSystem.sealedPassword.decrypt(encyptedPassword),
              taskQueue
            );
          }

          const fromAddress = `${profileDetails.firstName} ${profileDetails.lastName} <${emailAddress}>`;
          const brands = getRecipientsWithStatus(state).map((r, i) => ({
            brand: r.brand,
            index: i
          }));
          const {
            requestType,
            requestSubject,
            requestTemplateText
          } = state.newRequestState;
          const textTemplate = replaceProfileInfo(
            requestTemplateText,
            profileDetails
          );

          if (isForwarder) {
            await transport.sendMessage(
              {
                from: fromAddress,
                to: '',
                subject: requestSubject,
                text: requestTemplateText
              },
              brands.map(b => b.brand.id.toString()).filter(x => !!x)
            );
          }

          await defer(
            from(brands).pipe(
              mergeMap(({ brand, index }) =>
                fromThunky(async dispatch => {
                  const dpo = await apiService.getDpo(
                    brand.data_protection_officer
                  );
                  const company = await apiService.getCompany(brand.company);
                  const requestText = clearTemplateFields(
                    replaceCompanyInfo(textTemplate, company)
                  );
                  const newGroup = await clientBackend.createRequestGroup({
                    brandId: brand.id,
                    dateTimeCreated: new Date().toISOString(),
                    snoozeCount: 0,
                    requestGroupType: requestType,
                    brandName: brand.name,
                    companyName: company.name
                  });
                  dispatch(addRequestGroups([newGroup]));
                  const newRequest = await clientBackend.createEmailRequest({
                    requestGroupId: newGroup.id,
                    requestType: 'data',
                    inCreation: true,
                    from: fromAddress,
                    to: dpo.email,
                    subject: requestSubject,
                    text: requestText
                  });
                  dispatch(addEmailRequests([newRequest]));
                  dispatch(setRecipientStatus({ index, status: 'prepared' }));
                  let messageId;
                  if (!isForwarder) {
                    messageId = await transport!.sendMessage(newRequest);
                  }
                  newRequest.inCreation = false;
                  newRequest.dateTimeSent = new Date().toISOString();
                  newRequest.messageId = messageId;
                  await clientBackend.updateEmailRequest(newRequest);
                  dispatch(addEmailRequests([newRequest]));
                  dispatch(setRecipientStatus({ index, status: 'sent' }));
                })
              )
            )
          );
          if (taskQueueSubscription) {
            taskQueueSubscription!.unsubscribe();
            taskQueueSubscription = null;
          }
          dispatch(newRequestSubmissionSuccess());
          dispatch(newRequestSent());

          trackRequests(state$.value, tracker, 'completed');
        } catch (error) {
          if (taskQueueSubscription) {
            taskQueueSubscription!.unsubscribe();
            taskQueueSubscription = null;
          }
          dispatch(newRequestSubmissionError());
          dispatch(pushAlert('Es ist ein Fehler aufgetreten.'));
          trackRequests(state$.value, tracker, 'error');
        }
      })
    )
  );

export const requestTypeEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(selectRequestType)),
    concatMap(() =>
      fromThunky(async dispatch => {
        const state = state$.value;
        const originalTemplate = getOriginalRequestTemplate(state);
        dispatch(setRequestTemplateText(originalTemplate.text));
        dispatch(setRequestSubject(originalTemplate.subject));
      })
    )
  );
export const fetchTagsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    filter(isActionOf(tagsRequested)),
    mergeMap(action =>
      fromThunky(async dispatch => {
        try {
          const tagsById: IdMap<Tag> = {};
          const tags = await apiService.getTags();
          tags.forEach(tag => (tagsById[tag.id] = tag));
          dispatch(tagsReceived(tagsById));
        } catch (error) {
          dispatch(tagsRequestFailed());
        }
      })
    )
  );
export const fetchBrandsAndTagsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    filter(isActionOf(brandsRequested)),
    mergeMap(action =>
      fromThunky(async dispatch => {
        try {
          const currentPage = action.payload.pageNumber;
          const state = state$.value;
          const searchText = state.newRequestState.selectSearchFilter;
          const filteredTagIds = state.newRequestState.tagFilter;
          const paginatedBrands = state.newRequestState.brands.paginatedBrands;
          let brandsList: Brand[] = [];
          let tagsById: IdMap<Tag> = {};
          let totalCount = 0;
          let hasMore = false;
          // don't cache while filtering
          if (paginatedBrands.brandsByPageNumber[currentPage]) {
            //brands cache found;load from cache
            brandsList = paginatedBrands.brandsByPageNumber[currentPage];
            totalCount = state.newRequestState.brands.totalCount;
            hasMore = paginatedBrands.hasMore;
            tagsById = state.newRequestState.tags;
          } else {
            // get data from API
            const brandsResponse = await apiService.getBrands(
              currentPage,
              searchText,
              filteredTagIds
            );
            brandsList = brandsResponse.results;
            totalCount = brandsResponse.count;
            hasMore = !!brandsResponse.next;

            // fetch tags
            const localTags = state.newRequestState.tags;
            if (isEmptyMap(localTags)) {
              const tags = await apiService.getTags();
              tags.forEach(tag => (tagsById[tag.id] = tag));
            } else {
              tagsById = localTags;
            }

            // merge tags with brands
            brandsList = brandsList.map(brand => ({
              ...brand,
              formattedTags: tagGenerator(brand.tags, tagsById)
            }));
          }

          const brandsById: IdMap<Brand> = {};
          brandsList.forEach(brand => (brandsById[brand.id] = brand));
          const totalBrands = totalCount;
          dispatch(
            brandsReceived({
              brandsList: brandsList,
              byId: brandsById,
              hasMore: hasMore,
              totalCount: totalBrands,
              pageNumber: currentPage
            })
          );
          dispatch(tagsReceived(tagsById));
        } catch (error) {
          dispatch(brandsRequestFailed());
        }
      })
    )
  );

export const fetchSearchedBrandsEpic: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(setSelectSearchFilter)),
    switchMap(action =>
      fromThunky(async dispatch => {
        if (action.payload.trim().length >= 2) {
          dispatch(brandsCleared());
          dispatch(
            brandsRequested({ pageNumber: 1, autocompleteText: action.payload })
          );
        } else if (action.payload.trim().length === 0) {
          dispatch(brandsCleared());
          dispatch(
            brandsRequested({ pageNumber: 1, autocompleteText: undefined })
          );
        }
      })
    )
  );

export const fetchFilteredBrandsByTagsEpic: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(setBrandTagFilter)),
    switchMap(action =>
      fromThunky(async dispatch => {
        dispatch(brandsCleared());
        dispatch(brandsRequested({ pageNumber: 1, tagIds: action.payload }));
      })
    )
  );

export const fetchRecommendedBrandsEpic: Epic = (
  action$,
  state$,
  { apiService }
) =>
  action$.pipe(
    filter(isActionOf(recommendedBrandsRequested)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const state = state$.value;
        const selectedBrandIds = Object.keys(
          state.newRequestState.brandSelection
        ).map(key => parseInt(key));
        const storedRecommendedBrands = state.newRequestState.recommendedBrands;
        if (isEmptyMap(storedRecommendedBrands)) {
          try {
            const recommendedBrands = await apiService.getBrandsByIds({
              ids: selectedBrandIds
            });
            const recommendedBrandsById: IdMap<Brand> = {};
            recommendedBrands.map(brand => {
              recommendedBrandsById[brand.id] = brand;
            });
            dispatch(recommendedBrandsReceived(recommendedBrandsById));
          } catch (error) {
            dispatch(recommendedBrandsRequestFailed());
          }
        }
      })
    )
  );

export const fetchEmailTemplatesEpic: Epic = (
  action$,
  state$,
  { apiService }
) =>
  action$.pipe(
    filter(isActionOf(emailTemplatesRequested)),
    concatMap(action =>
      fromThunky(async dispatch => {
        try {
          const emailTemplatesResponse = await apiService.getEmailTemplates(
            action.payload
          );
          const emailTemplatesList: HashMap<EmailTemplate> = {};
          emailTemplatesResponse.results.forEach(
            et => (emailTemplatesList[et.type] = et)
          );
          dispatch(emailTemplatesReceived(emailTemplatesList));
        } catch (error) {
          dispatch(emailTemplatesRequestFailed());
        }
      })
    )
  );
