import chai from 'chai';
import { buildEnvironmentUrl } from './ajax-wrapper';

describe('Ajax wrapper tests', () => {
  describe('environment-specific query string', () => {
    it('should add the _env param for dev', () => {
      process.env.NODE_ENV = 'development';

      const originalUrl = 'https://google.com';
      const transformedUrl = buildEnvironmentUrl(originalUrl);

      chai.expect(transformedUrl).eq('https://google.com/?_env=dev');
    });

    it('should add the _env param for prod', () => {
      process.env.NODE_ENV = 'production';

      const originalUrl = 'https://google.com';
      const transformedUrl = buildEnvironmentUrl(originalUrl);

      chai.expect(transformedUrl).eq('https://google.com/?_env=prod');
    });
  });
});
