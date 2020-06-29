import React from 'react';
import { FormikValues, FormikProps, getIn, FieldInputProps } from 'formik';
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export const CustomDatePicker: React.FC<FDatePickerProps> = props => {
  const {
    label,
    field,
    form: { touched, errors, setFieldValue },
    keyboard,
    ...other
  } = props;
  const errorText = getIn(errors, field.name);
  const touchedVal = getIn(touched, field.name);
  const hasError = touchedVal && errorText !== undefined;

  const getFormattedDate = (date: Date | null) =>
    date
      ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      : '';

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {keyboard ? (
        <KeyboardDatePicker
          label={label}
          error={hasError}
          helperText={hasError ? errorText : ''}
          onChange={value => setFieldValue(field.name, getFormattedDate(value))}
          value={field.value}
          {...other}
        />
      ) : (
        <DatePicker
          label={label}
          error={hasError}
          helperText={hasError ? errorText : ''}
          onChange={value => setFieldValue(field.name, getFormattedDate(value))}
          value={field.value}
          {...other}
        />
      )}
    </MuiPickersUtilsProvider>
  );
};

interface FDatePickerProps {
  label?: string;
  field: FieldInputProps<string>;
  form: FormikProps<FormikValues> | FormikValues;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  autoOk?: boolean;
  placeholder?: string;
  className?: string;
  keyboard?: boolean;
  format?: string;
}
