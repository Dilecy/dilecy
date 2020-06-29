import { Mailer, Message, MessageTransport } from './interface';
import nodemailer from 'nodemailer';
import {
  isDevelopment,
  TESTING_EMAIL_TO
} from '../../shared/utils/environment';
import { googleMailer } from '../google/googleMailer';
import { TaskQueue } from '../google/callQueue';
import { defer } from 'rxjs';

export function createMailer(): Mailer {
  const createSMTPPayload = (
    host: string,
    port: number,
    user: string,
    pass: string
  ) => ({
    host,
    port,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  function getTransportInner(
    payload: any,
    taskQueue: TaskQueue
  ): MessageTransport {
    const transport = nodemailer.createTransport(payload);
    return {
      sendMessage: async (m: Message) => {
        if (isDevelopment()) {
          replaceRecipients(m);
        }

        const operation = defer(() => transport.sendMail(m));

        const taskResult = await taskQueue
          .push({
            id: `${m.from}-${m.to}-${new Date().getTime()}`,
            operation
          })
          .toPromise();

        return taskResult.messageId;
      },
      verify: async () => {
        try {
          const verified = await transport.verify();
          return { verified };
        } catch (error) {
          const command = error.command || 'CONN';
          return {
            verified: false,
            error: command === 'CONN' ? 'host' : 'auth'
          };
        }
      }
    };
  }

  const replaceRecipients = (m: Message) => {
    m.to = TESTING_EMAIL_TO;
    if (m.cc) {
      m.cc = TESTING_EMAIL_TO;
    }
    if (m.bcc) {
      m.bcc = TESTING_EMAIL_TO;
    }
  };

  return {
    getSmtpTransport: (host, port, user, pass, taskQueue) => {
      const payload = createSMTPPayload(host, port, user, pass);
      return getTransportInner(payload, taskQueue!);
    },
    getGoogleTransport: (taskQueue, apiClient) => {
      return {
        sendMessage: async (m: Message) => {
          if (isDevelopment()) {
            replaceRecipients(m);
          }
          const msgInfo = await googleMailer.sendMail(m, taskQueue, apiClient);
          return msgInfo.data.id!;
        },
        verify: async () => {
          return {
            verified: true
          };
        }
      };
    }
  };
}
