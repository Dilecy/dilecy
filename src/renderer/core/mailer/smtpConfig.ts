import { ajax } from 'rxjs/ajax';

const getValue = (e: Element, tagName: string) =>
  e.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;

export const autoConfig = async (emailAddress: string) => {
  const [alias, domain] = emailAddress.split('@');
  const url = `https://autoconfig.thunderbird.net/v1.1/${domain}`;
  const config = {
    smtpUser: emailAddress,
    smtp: `smtp.${domain}`,
    smtpPort: 587
  };
  try {
    const result = await ajax({
      url,
      responseType: 'document'
    }).toPromise();
    const response = result.response as Document;
    const outgoing = response.getElementsByTagName('outgoingServer')[0];
    config.smtp = getValue(outgoing, 'hostname') || config.smtp;
    config.smtpPort = parseInt(getValue(outgoing, 'port') || '587');
    config.smtpUser =
      getValue(outgoing, 'username') === '%EMAILADDRESS%'
        ? emailAddress
        : alias;
  } catch (error) {
    console.error(error);
  }
  return config;
};
