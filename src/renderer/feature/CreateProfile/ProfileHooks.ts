import { useState } from 'react';
import { useFormik, FormikProps, getIn } from 'formik';
import * as Yup from 'yup';
import { useMailer } from '../../core/dependencies';
import { autoConfig } from '../../core/mailer/smtpConfig';

const validationSchema = Yup.object({
  profileName: Yup.string().required('Erfordert'),
  password: Yup.string().min(4),
  firstName: Yup.string().required('Erfordert'),
  lastName: Yup.string().required('Erfordert'),
  dateOfBirth: Yup.date().required('Erfordert'),
  streetName: Yup.string().required('Erfordert'),
  houseNumber: Yup.string().required('Erfordert'),
  zipCode: Yup.string().required('Erfordert'),
  city: Yup.string().required('Erfordert'),
  state: Yup.string().required('Erfordert'),
  country: Yup.string().required('Erfordert'),
  emailAddress: Yup.string()
    .email('Ungültige E-Mail Addresse`')
    .required('Erfordert'),
  emailPassword: Yup.string().required('Erfordert'),
  smtp: Yup.string(),
  smtpUser: Yup.string(),
  smtpPort: Yup.number()
});

const emailValidationSchema = Yup.object({
  emailAddress: Yup.string()
    .email('Ungültige E-Mail Addresse`')
    .nullable(),
  emailPassword: Yup.string(),
  smtp: Yup.string(),
  smtpUser: Yup.string(),
  smtpPort: Yup.number()
});

const profileDataValidationSchema = Yup.object({
  profileName: Yup.string().required('Erfordert'),
  password: Yup.string()
    .required('Erfordert')
    .min(4, 'Mindestens 4 Zeichen'),
  password2: Yup.string()
    .required('Erfordert')
    .min(4, 'Mindestens 4 Zeichen')
});

const profileDetailsValidationSchema = Yup.object({
  firstName: Yup.string()
    .nullable()
    .required('Erfordert'),
  lastName: Yup.string()
    .nullable()
    .required('Erfordert'),
  dateOfBirth: Yup.date()
    .required('Erfordert')
    .nullable()
    .typeError('Ungültiges Datum'),
  streetName: Yup.string()
    .nullable()
    .required('Erfordert'),
  houseNumber: Yup.string()
    .nullable()
    .required('Erfordert'),
  zipCode: Yup.string()
    .nullable()
    .required('Erfordert'),
  city: Yup.string()
    .nullable()
    .required('Erfordert'),
  state: Yup.string()
    .nullable()
    .required('Erfordert'),
  country: Yup.string()
    .nullable()
    .required('Erfordert')
});

const defaultProfileData = {
  profileName: '',
  password: '',
  password2: ''
};

export const defaultProfileDetails = {
  profileName: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  streetName: '',
  houseNumber: '',
  zipCode: '',
  city: '',
  state: '',
  country: ''
};

export const defaultEmail = {
  emailAddress: '',
  emailPassword: '',
  smtp: '',
  smtpUser: '',
  smtpPort: 0,
  isGoogle: false
};

const defaultProfile = {
  password: '',
  password2: '',
  ...defaultProfileDetails,
  ...defaultEmail
};

export const defaultEmailForwardFormValues = {
  emailAddress: ''
};

export type ProfileDetailsFormValues = typeof defaultProfileDetails;
export type EmailFormValues = typeof defaultEmail;
export type EmailForwardFormValues = typeof defaultEmailForwardFormValues;
export type ProfileFormValues = typeof defaultProfile;
export type ProfileDataFormValues = typeof defaultProfileData;

function fieldProps<V>(id: string, formik: FormikProps<V>) {
  const error = getIn(formik.errors, id) && getIn(formik.touched, id);
  const helperText = error ? getIn(formik.errors, id) : undefined;
  return {
    id,
    error,
    helperText,
    ...formik.getFieldProps(id)
  };
}

interface FormProps<V> {
  submitAction: (values: V) => Promise<void>;
  initialValues?: V;
}

export const useProfileDataForm = ({
  initialValues,
  submitAction
}: FormProps<ProfileDataFormValues>) => {
  const formik = useFormik({
    initialValues: initialValues || defaultProfileData,
    validationSchema: profileDataValidationSchema,
    validate: values => {
      const errors: Partial<ProfileFormValues> = {};
      if (values.password !== values.password2) {
        errors.password2 = 'Passwörter nicht identisch';
      }
      return errors;
    },
    onSubmit: async values => {
      submitAction && (await submitAction(values));
    }
  });
  return {
    form: formik,
    fieldProps: (id: string) => fieldProps<ProfileDataFormValues>(id, formik)
  };
};

export const useProfileDetailsForm = ({
  initialValues,
  submitAction
}: FormProps<ProfileDetailsFormValues>) => {
  const formik = useFormik({
    initialValues: initialValues || defaultProfileDetails,
    validationSchema: profileDetailsValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      submitAction && (await submitAction(values));
      setSubmitting(false);
    }
  });
  return {
    form: formik,
    fieldProps: (id: string) => fieldProps<ProfileDetailsFormValues>(id, formik)
  };
};

function useFormWithAutoConfig<V extends EmailFormValues | ProfileFormValues>(
  defaultValues: V,
  validate?: (values: V) => object,
  inputValidationSchema?: Yup.ObjectSchema
) {
  return ({ submitAction, initialValues }: FormProps<V>) => {
    const [doAutoConfig, setDoAutoConfig] = useState(true);
    const [loading, setLoading] = useState(false);
    const mailer = useMailer();
    const formik = useFormik({
      initialValues: initialValues || defaultValues,
      validationSchema: inputValidationSchema || validationSchema,
      validate,
      onSubmit: async (values, { setSubmitting, setFieldError }) => {
        if (values.isGoogle) {
          return await submitAction(values);
        } else {
          let fieldsFailed = false;
          if (!values.emailPassword) {
            setFieldError('emailPassword', 'Erfordert');
            fieldsFailed = true;
          }
          if (!values.emailAddress) {
            setFieldError('emailAddress', 'Erfordert');
            fieldsFailed = true;
          }

          // Manual field validation failed, do not proceed with smtp check
          if (fieldsFailed) {
            return;
          }
        }

        setSubmitting(true);
        const { emailAddress, emailPassword } = values;
        const isEmailValidated =
          (initialValues && initialValues.emailAddress === emailAddress) ||
          false;
        const isPasswordValidated =
          initialValues && initialValues.emailPassword === emailPassword;
        if (isEmailValidated && isPasswordValidated) {
          return await submitAction(values);
        }
        if (doAutoConfig) {
          setLoading(true);
          const config = await autoConfig(emailAddress);
          Object.assign(values, config);
          setLoading(false);
        }

        const { smtp, smtpPort, smtpUser } = values;
        const { verified, error } = await mailer
          .getSmtpTransport(smtp, smtpPort, smtpUser, emailPassword)
          .verify();
        if (verified) {
          await submitAction(values);
        } else {
          if (error === 'auth') {
            setFieldError(
              'emailAddress',
              'Authentifizierung fehlgeschlagen. E-Mail, '
            );
            setFieldError('emailPassword', 'Passwort ...');
            setFieldError('smtpUser', '... oder SMTP Username falsch.');
          } else {
            setFieldError(
              'smtp',
              'Verbindungsaufbau fehlegeschlagen. SMTP Server und'
            );
            setFieldError(
              'smtpPort',
              'Port manuell konfigurieren, oder mit andere E-Mail Adresse erneut versuchen.'
            );
          }
          setDoAutoConfig(false);
          setSubmitting(false);
        }
      }
    });
    return {
      form: formik,
      fieldProps: (id: string) => fieldProps<V>(id, formik),
      doAutoConfig,
      loading,
      retryAutoConfig: () => setDoAutoConfig(true)
    };
  };
}

export const useEmailForm = useFormWithAutoConfig(
  defaultEmail,
  () => ({}),
  emailValidationSchema
);
export const useProfileForm = useFormWithAutoConfig(defaultProfile, values => {
  const errors: Partial<ProfileFormValues> = {};
  if (values.password !== values.password2) {
    errors.password2 = 'Passwörter nicht identisch';
  }
  return errors;
});
