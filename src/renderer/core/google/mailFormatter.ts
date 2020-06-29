import { Message } from '../mailer/interface';
import { Base64 } from 'js-base64';

export const mailFormatter = {
  formatMail: (m: Message) => {
    // By the RFC Standard, Email subject MUST be in US ASCII (7-bit).
    const origBody =
      `To: <${m.to}> \n` +
      `From: ${m.from} \n` +
      `Subject: =?utf-8?B?${Base64.encode(m.subject)}?= \n\n${m.text}`;

    return Base64.encode(origBody)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
};
