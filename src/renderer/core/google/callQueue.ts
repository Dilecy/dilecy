import {
  interval,
  of,
  combineLatest,
  Subject,
  Observable,
  throwError
} from 'rxjs';
import { catchError, tap, filter, take, map, mergeMap } from 'rxjs/operators';

const MIN_RATE = 1;
const MAX_RATE = 10;
const MAX_FAIL_COUNT = 15;

export interface TaskQueue {
  init: (num: number) => Observable<any[]>;
  push: (task: { id: string; operation: Observable<any> }) => Observable<any>;
}

export const createTaskQueue = (): TaskQueue => {
  const taskQueue: {
    id: string;
    operation: Observable<any>;
    failCount: number;
  }[] = [];
  let rate = MIN_RATE;
  let notifier$: Subject<{ id: string; result: any }>;

  return {
    init(num: number) {
      notifier$ = new Subject<{ id: string; result: any }>();
      return interval(num).pipe(
        map(() => taskQueue.splice(0, rate)),
        filter(currentOperations => !!currentOperations.length),
        mergeMap(currentOperations => {
          const deferred = currentOperations.map(task =>
            task.operation.pipe(
              tap((result: any) => {
                if (rate < MAX_RATE) {
                  rate++;
                }
                notifier$.next({ id: task.id, result });
              }),
              catchError(err => {
                task.failCount++;
                if (task.failCount === MAX_FAIL_COUNT) {
                  taskQueue.length = 0;
                  notifier$.error(new Error('FAIL_COUNT'));
                  return throwError(new Error('FAIL_COUNT'));
                }

                if (rate > MIN_RATE) {
                  rate--;
                }
                taskQueue.push(task);
                return of(null);
              })
            )
          );
          return combineLatest([...deferred]);
        })
      );
    },
    push(task: { id: string; operation: Observable<any> }) {
      taskQueue.push({ ...task, failCount: 0 });
      return notifier$.pipe(
        filter(result => result.id === task.id),
        map(op => op.result),
        take(1)
      );
    }
  };
};
