import { ajaxWrapper } from './ajax-wrapper';
import { expand, reduce } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

export interface PaginatedResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T;
}

/**
 * Does a http GET request and returns a generic promise
 * @param url
 * @returns
 */
export const getRequest = <T>(url: string) =>
  ajaxWrapper.getJSON<T>(url).toPromise() as Promise<T>;

/**
 *
 * /**
 * Does a paginated GET Request
 * @param url of type string
 * @param nextUrl optional url to load next pages
 * @returns a Promise of type generic PaginatedResponse
 */

export const getRequestPaginated = <T>(
  url: string,
  pageNumber: number
): Promise<PaginatedResponse<T>> => {
  const urlWithParams = new URL(url);
  urlWithParams.searchParams.append('page', pageNumber.toString());
  return ajaxWrapper.getJSON(urlWithParams.toString()).toPromise() as Promise<
    PaginatedResponse<T>
  >;
};

export const postRequest = <T>(url: string, body: T) =>
  ajaxWrapper.post(url, body).toPromise();

export const postJSON = <T>(url: string, body: T) =>
  ajaxWrapper.postJSON(url, body).toPromise();

export const patchJSON = <T>(url: string, body: T) =>
  ajaxWrapper.patchJSON(url, body).toPromise();

export const postAll = <T, U>(url: string, body: U): Observable<T[]> => {
  return ajaxWrapper.postJSON<PaginatedResponse<T>, U>(url, body).pipe(
    expand(result => {
      return result.next
        ? ajaxWrapper.postJSON<PaginatedResponse<T>, U>(result.next, body)
        : empty();
    }),
    reduce(
      (acc, data) => {
        return acc.concat(data.results);
      },
      [] as T[]
    )
  );
};

export const fetchAll = <T>(path: string): Observable<T[]> => {
  return ajaxWrapper.getJSON<PaginatedResponse<T[]>>(path).pipe(
    expand(result => {
      return result.next
        ? ajaxWrapper.getJSON<PaginatedResponse<T>>(result.next)
        : empty();
    }),
    reduce(
      (acc, data) => {
        return acc.concat(data.results);
      },
      [] as T[]
    )
  );
};
