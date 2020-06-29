import { Observable } from 'rxjs';
import { RootAction } from 'typesafe-actions';

export type Thunky = (
  dispatch: (action: RootAction) => void,
  defer: (obs: Observable<RootAction>) => Promise<void>
) => Promise<void> | void;

/**
 * Expects a function of type Thunky consisting of two callback functions dispatch and defer.
 * It is used to perform a chain of async operations such as api calls, database operations etc.
 *
 * The dispatch callback accepts a redux action and dispatches the action.
 *
 * The defer callback accepts an action stream and returns a promise
 *
 * @param thunky
 */
export const fromThunky = (thunky: Thunky) =>
  new Observable<RootAction>(subscriber => {
    const dispatch = (action: RootAction) => subscriber.next(action);
    const defer = (actionStream$: Observable<RootAction>) =>
      new Promise<void>((resolve, reject) => {
        actionStream$.subscribe({
          next: action => subscriber.next(action),
          complete: resolve,
          error: reject
        });
      });
    const promise = thunky(dispatch, defer);

    if (promise) {
      promise
        .then(() => subscriber.complete())
        .catch(error => subscriber.error(error));
    } else {
      subscriber.complete();
    }
  });
