import { Mailer } from './interface';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function createMailerMock(latencyInMs: number): Mailer {
  let messageNumber = 0;
  let verificationCount = 0;
  return {
    getGoogleTransport: refreshToken => ({
      sendMessage: async message => {
        messageNumber += 1;
        const messageId = `Sending message #${messageNumber} via Google API with refresh token: ${refreshToken}`;
        console.log(messageId);
        console.log(message);
        await sleep(latencyInMs);
        console.log(`Done #${messageNumber}`);
        return messageId;
      },

      verify: async () => {
        console.log('Check mail server');
        verificationCount = verificationCount + 1;
        return {
          verified: verificationCount % 3 === 0,
          error: verificationCount % 3 === 1 ? 'host' : 'auth'
        };
      }
    }),
    getSmtpTransport: (host, port, username, password) => ({
      sendMessage: async message => {
        messageNumber += 1;
        const messageId = `Sending message #${messageNumber} via ${host}:${port} @${username}[${password}]`;
        console.log(messageId);
        console.log(message);
        await sleep(latencyInMs);
        console.log(`Done #${messageNumber}`);
        return messageId;
      },

      verify: async () => {
        console.log('Check mail server');
        verificationCount = verificationCount + 1;
        return {
          verified: verificationCount % 3 === 0,
          error: verificationCount % 3 === 1 ? 'host' : 'auth'
        };
      }
    })
  };
}
