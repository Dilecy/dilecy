import chai from 'chai';
import { ActionsObservable } from 'redux-observable';
import { feedbackDone, startFeedback } from './actions';
import { startFeedbackEpic } from './epics';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { EpicMiddleware } from '../../store/root-epic';
import { dependencies } from '../../index.mock';
import chaiSpies from 'chai-spies';

chai.use(chaiSpies);
chai.should();

describe('startFeedbackEpic', () => {
  it('should call api endpoint', async () => {
    let epicMiddleware: EpicMiddleware;

    const mockStore = (...args: any[]) => {
      epicMiddleware = createEpicMiddleware({ dependencies });
      const factory = configureMockStore([epicMiddleware]);
      return factory(...args);
    };

    const store = mockStore({});

    const feedbackSpy = chai.spy.on(
      dependencies.apiService,
      'postFeedback',
      () => Promise.resolve()
    );

    const actions$ = ActionsObservable.of(startFeedback('hello'));
    const res = await startFeedbackEpic(
      actions$,
      store as any,
      dependencies
    ).toPromise();

    chai.expect(res.type).to.eq(feedbackDone().type);

    chai.expect(feedbackSpy).to.have.been.called.with('hello');
  });
});
