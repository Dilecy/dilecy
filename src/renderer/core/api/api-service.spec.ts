import chai from 'chai';
import { createApiService } from './api-service';
import { ApiService } from './api-interface';
import { ajaxWrapper } from './ajax-wrapper';
import { of } from 'rxjs';
import chaiSpies from 'chai-spies';
chai.use(chaiSpies);
chai.should();

describe('Api service tests', () => {
  let sut: ApiService;
  let postJsonSpy: any;
  let patchJsonSpy: any;
  let postSpy: any;

  beforeEach(() => {
    sut = createApiService('http://testapi');
    postJsonSpy = chai.spy.on(ajaxWrapper, 'postJSON', () => of({}));
    patchJsonSpy = chai.spy.on(ajaxWrapper, 'patchJSON', () => of({}));
    postSpy = chai.spy.on(ajaxWrapper, 'post', () => of({}));
  });

  describe('postRating', () => {
    it('should make the proper HTTP request', async () => {
      await sut.postRating(1);
      chai
        .expect(postJsonSpy)
        .to.have.been.called.with('http://testapi/ratings', { points: 1 });
    });
  });

  describe('patchRating', () => {
    it('should make the proper HTTP request', async () => {
      await sut.patchRating(1, 999, 'password');
      chai
        .expect(patchJsonSpy)
        .to.have.been.called.with(
          'http://testapi/ratings/999?password=password',
          {
            points: 1
          }
        );
    });
  });

  describe('postFeedback', () => {
    it('should make the proper HTTP request', async () => {
      await sut.postFeedback('message');
      chai.expect(postSpy).to.have.been.called.with('http://testapi/feedback', {
        message: 'message'
      });
    });
  });

  afterEach(() => {
    chai.spy.restore(ajaxWrapper, 'postJSON');
    chai.spy.restore(ajaxWrapper, 'patchJSON');
    chai.spy.restore(ajaxWrapper, 'post');
  });
});
