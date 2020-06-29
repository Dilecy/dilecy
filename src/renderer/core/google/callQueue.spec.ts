/* eslint-disable @typescript-eslint/camelcase */
import chai from 'chai';

import { createTaskQueue } from './callQueue';
import { of, combineLatest, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
chai.should();

describe('callQueue tests', () => {
  it('should handle a pushed observable', done => {
    const callQueue = createTaskQueue();
    callQueue.init(1).subscribe();
    callQueue
      .push({
        id: '1',
        operation: of('success')
      })
      .subscribe(val => {
        chai.expect(val).to.eq('success');
        done();
      });
  });

  it('should handle multiple observables', done => {
    const callQueue = createTaskQueue();

    callQueue.init(1).subscribe();

    const items$ = combineLatest(
      callQueue.push({
        id: '1',
        operation: of('success1')
      }),
      callQueue.push({
        id: '2',
        operation: of('success2')
      })
    );
    items$.subscribe(([val1, val2]) => {
      chai.expect(val1).to.eq('success1');
      chai.expect(val2).to.eq('success2');
      done();
    });
  });

  it('should throw an error when retryCount reached', done => {
    const callQueue = createTaskQueue();

    callQueue
      .init(1)
      .pipe(
        catchError(err => {
          console.log(JSON.stringify(err));
          chai.expect(err.message).to.eq('FAIL_COUNT');
          return of(null);
        })
      )
      .subscribe();

    const items$ = combineLatest(
      callQueue.push({
        id: '1',
        operation: throwError('err')
      })
    );
    items$.subscribe(
      () => {},
      err => {
        chai.expect(err.message).to.eq('FAIL_COUNT');
        done();
      }
    );
  });

  it('should retry failing observable', done => {
    const callQueue = createTaskQueue();

    callQueue.init(1).subscribe();
    let calls = 0;

    const failing$ = of(null).pipe(
      map(() => {
        if (calls === 0) {
          calls++;
          throw 'Error';
        } else {
          return 'success';
        }
      })
    );

    callQueue
      .push({
        id: '1',
        operation: failing$
      })
      .subscribe(val => {
        chai.expect(val).to.eq('success');

        done();
      });
  });

  it('should retry randomly failing items', done => {
    const callQueue = createTaskQueue();

    callQueue.init(1).subscribe();

    const createObservable = () => {
      return of(null).pipe(
        map(() => Math.random() * 10 > 5),
        map(shouldFail => {
          if (shouldFail) {
            throw 'Error';
          } else {
            return 'success';
          }
        })
      );
    };

    const items$ = combineLatest(
      callQueue.push({ id: '1', operation: createObservable() }),
      callQueue.push({ id: '2', operation: createObservable() }),
      callQueue.push({ id: '3', operation: createObservable() }),
      callQueue.push({ id: '4', operation: createObservable() }),
      callQueue.push({ id: '5', operation: createObservable() })
    );

    items$.subscribe(val => {
      chai.expect(val[0]).eq('success');
      chai.expect(val[1]).eq('success');
      chai.expect(val[2]).eq('success');
      chai.expect(val[3]).eq('success');
      chai.expect(val[4]).eq('success');

      done();
    });
  });
});
