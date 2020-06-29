import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useField, FieldAttributes } from 'formik';

export const CustomInputField: React.FC<FieldAttributes<{}>> = ({
  placeholder,
  type = 'text',
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      label={placeholder}
      type={type}
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      autoFocus={props.autoFocus}
    />
  );
};
