/* eslint-disable @typescript-eslint/camelcase */
import * as Yup from 'yup';

export const ProfileValidationSchema = Yup.object({
  profileName: Yup.string().required('Erfordert'),
  firstName: Yup.string().required('Erfordert'),
  lastName: Yup.string().required('Erfordert'),
  dateOfBirth: Yup.date()
    .required('Erfordert')
    .nullable()
    .typeError('Ungültiges Datum'),
  streetName: Yup.string().required('Erfordert'),
  houseNumber: Yup.string().required('Erfordert'),
  zipCode: Yup.string().required('Erfordert'),
  city: Yup.string().required('Erfordert'),
  state: Yup.string().required('Erfordert'),
  country: Yup.string().required('Erfordert')
});

export const ChangePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Erfordert'),
  newPassword: Yup.string()
    .min(4, 'Das Passwort muss aus mindestens vier Zeichen bestehen')
    .required('Erfordert'),
  confirmPassword: Yup.string()
    .required('Erfordert')
    .oneOf([Yup.ref('newPassword')], 'Passwörter nicht identisch')
});

export const EmailSettingsValidationSchema = Yup.object({
  emailAddress: Yup.string()
    .required('Erfordert')
    .email('Ungültige E-Mail Addresse'),
  emailPassword: Yup.string().required('Erfordert'),
  smtp: Yup.string(),
  smtpUser: Yup.string(),
  smtpPort: Yup.number()
});

export const MissingBrandValidationSchema = Yup.object({
  name: Yup.string().required('Erfordert'),
  company_name: Yup.string(),
  website_url: Yup.string(),
  data_protection_officer_email: Yup.string().email(
    'Ungültige E-Mail Addresse'
  ),
  address_1: Yup.string(),
  city: Yup.string(),
  zip_code: Yup.string().max(5, 'Maximal 5 Zeichen erlaubt')
});

export const ForwardEmailSettingsValidationSchema = Yup.object({
  emailAddress: Yup.string()
    .required('Erfordert')
    .email('Ungültige E-Mail Addresse')
});
