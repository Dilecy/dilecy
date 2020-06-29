import { Company } from '../../model/serverModel';
import { ProfileDetails } from '../../model/clientModel';

export const templateFields = (s: string) =>
  (s.match(/{{([^}]*)}}/g) || []).map(m => (m.match(/[^{}\s]+/g) || [''])[0]);

export const hasTemplateField = (s: string, field: string) =>
  new RegExp(`{{\\s*${field}\\s*}}`).test(s);

export const replaceTemplateField = (
  s: string,
  field: string,
  value: string | null
) => {
  let newValue = value || '';
  return s.replace(new RegExp(`{{\\s*${field}\\s*}}`, 'g'), newValue);
};

export const clearTemplateFields = (s: string) => {
  let r = s;
  const fields = templateFields(s);
  fields.forEach(f => {
    r = replaceTemplateField(r, f, '');
  });
  return r;
};

export const replaceProfileInfo = (template: string, p: ProfileDetails) => {
  let t = template;
  t = replaceTemplateField(t, 'profile.firstname', p.firstName);
  t = replaceTemplateField(t, 'profile.lastname', p.lastName);
  t = replaceTemplateField(t, 'profile.date_of_birth', p.dateOfBirth);
  t = replaceTemplateField(t, 'profile.street', p.streetName);
  t = replaceTemplateField(t, 'profile.house_number', p.houseNumber);
  t = replaceTemplateField(t, 'profile.zip', p.zipCode);
  t = replaceTemplateField(t, 'profile.city', p.city);
  t = replaceTemplateField(t, 'profile.state', p.state);
  t = replaceTemplateField(t, 'profile.country', p.country);
  return t;
};

export const replaceCompanyInfo = (template: string, c: Company) => {
  let t = template;
  t = replaceTemplateField(t, 'company.name', c.name);
  t = replaceTemplateField(t, 'company.address1', c.address_1);
  t = replaceTemplateField(t, 'company.address2', c.address_2);
  t = replaceTemplateField(t, 'company.zip', c.zip_code);
  t = replaceTemplateField(t, 'company.city', c.city);
  t = replaceTemplateField(t, 'company.country', c.country);
  return t;
};
