import chai from 'chai';
import nodemailer from 'nodemailer';
import { createMailer } from './mailer';
import { TESTING_EMAIL_TO } from '../../shared/utils/environment';
import { createTaskQueue } from '../google/callQueue';

chai.use(require('chai-spies'));
chai.should();

describe('Mailer', () => {
  describe('internals', () => {
    it('should create an SMTP transport', () => {
      chai.spy.on(nodemailer, 'createTransport');
      const mailer = createMailer();
      mailer.getSmtpTransport('smtp.address.com', 123, 'test', 'password');

      chai.expect(nodemailer.createTransport).to.have.been.called.with({
        host: 'smtp.address.com',
        port: 123,
        auth: {
          user: 'test',
          pass: 'password'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    });

    afterEach(() => {
      chai.spy.restore(nodemailer, 'createTransport');
    });
  });

  describe('sendMessage', () => {
    const sendMailSpy = chai.spy.returns(Promise.resolve({}));

    beforeEach(() => {
      chai.spy.on(nodemailer, 'createTransport', returns => {
        return {
          sendMail: sendMailSpy
        };
      });
    });

    it('should replace the recepient when running in dev mode', async () => {
      process.env.NODE_ENV = 'development';
      const mailer = createMailer();

      const taskQueue = createTaskQueue();
      taskQueue.init(1).subscribe();

      await mailer.getSmtpTransport('', 0, '', '', taskQueue).sendMessage({
        from: 'a@a.aa',
        to: 'b@b.bb',
        subject: 'subject',
        text: 'text',
        cc: 'cc-address@aa.aa'
      });

      chai.expect(sendMailSpy).to.have.been.called.with({
        from: 'a@a.aa',
        to: TESTING_EMAIL_TO,
        subject: 'subject',
        text: 'text',
        cc: TESTING_EMAIL_TO
      });
    });

    it('should NOT replace the recepient when running in prod mode', async () => {
      process.env.NODE_ENV = 'production';
      const mailer = createMailer();

      const taskQueue = createTaskQueue();
      taskQueue.init(1).subscribe();

      await mailer.getSmtpTransport('', 0, '', '', taskQueue).sendMessage({
        from: 'a@a.aa',
        to: 'b@b.bb',
        subject: 'subject',
        text: 'text'
      });

      chai.expect(sendMailSpy).to.have.been.called.with({
        from: 'a@a.aa',
        to: 'b@b.bb',
        subject: 'subject',
        text: 'text'
      });
    });
    afterEach(() => {
      chai.spy.restore(nodemailer, 'createTransport');
    });
  });
});
