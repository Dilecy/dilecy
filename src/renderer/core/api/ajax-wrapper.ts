import { ajax } from 'rxjs/ajax';
import { Environment, getEnvironment } from '@dilecy/shared';
import { map } from 'rxjs/operators';

const getEnvironmentParameter = (): string => {
  switch (getEnvironment()) {
    case Environment.STAGING:
      return 'dev';
    case Environment.PROD:
      return 'prod';
    default:
      return '';
  }
};

export const buildEnvironmentUrl = (url: string): string => {
  const env = getEnvironmentParameter();

  const urlWithQuery = new URL(url);
  urlWithQuery.searchParams.set('_env', env);

  return urlWithQuery.href;
};

const getJSON = <T>(url: string, headers?: Record<string, any> | undefined) => {
  const environmentUrl = buildEnvironmentUrl(url);

  return ajax.getJSON<T>(environmentUrl, headers);
};

const post = <T>(
  url: string,
  body?: T,
  headers?: Record<string, any> | undefined
) => {
  const environmentUrl = buildEnvironmentUrl(url);

  return ajax.post(environmentUrl, body, headers);
};

const postJSON = <T, U>(url: string, body: U) => {
  const environmentUrl = buildEnvironmentUrl(url);

  return ajax
    .post(environmentUrl, body, {
      'Content-Type': 'application/json'
    })
    .pipe(map(result => result.response));
};

const patchJSON = <T, U>(url: string, body: U) => {
  const environmentUrl = buildEnvironmentUrl(url);

  return ajax
    .patch(environmentUrl, body, {
      'Content-Type': 'application/json'
    })
    .pipe(map(result => result.response));
};

export const ajaxWrapper = {
  /**
   * Wraps the rxjs ajax getJSON call and transforms the request
   * as required (e.g. adding environment-specific parameters).
   * @param url
   * @param headers
   * @returns
   */
  getJSON,

  /**
   * Wraps the rxjs ajax post call and transforms the request
   * as required (e.g. adding environment-specific parameters).
   * @param url
   * @param body
   * @param headers
   * @returns
   */
  post,

  postJSON,

  patchJSON
};
