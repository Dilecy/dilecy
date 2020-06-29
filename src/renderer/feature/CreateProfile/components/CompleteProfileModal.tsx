import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ProfileDetails, Profile } from '../../../model/clientModel';
import { RootState } from 'typesafe-actions';
import DateFnsUtils from '@date-io/date-fns';
import MuiPickersUtilsProvider from '@material-ui/pickers/MuiPickersUtilsProvider';
import { updateProfile } from '../../ProfileSettings/actions';
import { selectView } from '../../../core/actions';
import { useProfileDetailsForm } from '../ProfileHooks';
import { localization as localizations } from '../../../shared/localization';
import { CustomDatePicker } from '../../../shared/components/CustomDatePicker';
import StyledButton from '../../../shared/components/StyledButton';
import StyledButtonOutlined from '../../../shared/components/StyledButtonOutlined';
import { customTheme } from '../../../shared/styles/theme';

import { getLoggedInProfile, getLoggedInProfileDetails } from '../selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    paper: {
      maxWidth: '65rem',
      backgroundColor: theme.palette.background.paper,
      borderRadius: customTheme.borderRadius,
      boxShadow: customTheme.shadow,
      padding: theme.spacing(customTheme.spacing),
      outline: 'none'
    },
    textfield: {
      margin: theme.spacing(1),
      minHeight: '5.625rem',
      flexGrow: 1
    },
    heading: {
      fontWeight: 'bold',
      paddingBottom: '2em'
    },
    customDatePicker: {
      padding: theme.spacing(1),
      width: 100,
      flexGrow: 1
    },
    body: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    },
    item: {
      display: 'flex'
    },
    button: {
      padding: theme.spacing(1),
      margin: theme.spacing(1)
    },
    mt2: {
      marginTop: '2rem'
    },
    justifyContentFlexEnd: {
      justifyContent: 'flex-end'
    }
  })
);

const labels = {
  firstName: localizations.LABEL_FIRST_NAME,
  lastName: localizations.LABEL_LAST_NAME,
  dateOfBirth: localizations.LABEL_DATE_OF_BIRTH,
  streetName: localizations.LABEL_STREET_NAME,
  houseNumber: localizations.LABEL_HOUSE_NUMBER,
  zipCode: localizations.LABEL_ZIP_CODE,
  city: localizations.LABEL_CITY,
  state: localizations.LABEL_STATE,
  country: localizations.LABEL_COUNTRY
};

interface Props {
  profile: Profile | undefined;
  profileDetails: ProfileDetails | undefined;

  selectView: typeof selectView;
  updateProfile: typeof updateProfile;
}

const CompleteProfileModal = (props: Props) => {
  const classes = useStyles();

  const { profile, profileDetails, selectView, updateProfile } = props;

  const [isOpen, setIsOpen] = useState(false);

  const isEmpty = (value: string | null) => Boolean(!value);

  useEffect(() => {
    if (profileDetails) {
      const {
        firstName,
        lastName,
        dateOfBirth,
        streetName,
        houseNumber,
        zipCode,
        city,
        state,
        country
      } = profileDetails;

      if (
        isEmpty(firstName) ||
        isEmpty(lastName) ||
        isEmpty(dateOfBirth) ||
        isEmpty(streetName) ||
        isEmpty(houseNumber) ||
        isEmpty(zipCode) ||
        isEmpty(city) ||
        isEmpty(state) ||
        isEmpty(country)
      ) {
        setIsOpen(true);
      }
    }
  }, []);

  const abort = () => {
    selectView('home');
  };

  const getInitialValue = (propertyName: string, nullable?: boolean) => {
    const defaultValue = nullable ? null : '';
    if (profileDetails) {
      return (profileDetails as any)[propertyName] || defaultValue;
    }
    return defaultValue;
  };

  const { form, fieldProps } = useProfileDetailsForm({
    submitAction: async values => {
      if (profile) {
        updateProfile({
          profile,
          profileDetails: values
        });

        setIsOpen(false);
      }
    },
    initialValues: {
      profileName: getInitialValue('profileName'),
      firstName: getInitialValue('firstName'),
      lastName: getInitialValue('lastName'),
      dateOfBirth: getInitialValue('dateOfBirth', true),
      streetName: getInitialValue('streetName'),
      houseNumber: getInitialValue('houseNumber'),
      zipCode: getInitialValue('zipCode'),
      city: getInitialValue('city'),
      state: getInitialValue('state'),
      country: getInitialValue('country')
    }
  });

  const textFieldProps = (id: keyof typeof labels) => ({
    label: labels[id],
    className: classes.textfield,
    ...fieldProps(id)
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    form.submitForm();
  };

  const body = (
    <div className={classes.paper}>
      <div>
        <Typography variant="h6" align="left" className={classes.heading}>
          {localizations.PERSONAL_DETAILS}
        </Typography>
        <form>
          <Grid container>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('firstName')}
                    placeholder={localizations.LABEL_FIRST_NAME}
                    autoFocus
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('lastName')}
                    placeholder={localizations.LABEL_LAST_NAME}
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <CustomDatePicker
                    className={classes.customDatePicker}
                    field={textFieldProps('dateOfBirth')}
                    form={form}
                    label={localizations.LABEL_DATE_OF_BIRTH}
                    placeholder={localizations.LABEL_DATE_OF_BIRTH}
                    keyboard={true}
                    format="dd.MM.yyyy"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('streetName')}
                    placeholder={localizations.LABEL_STREET_NAME}
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('houseNumber')}
                    placeholder={localizations.LABEL_HOUSE_NUMBER}
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('zipCode')}
                    placeholder={localizations.LABEL_ZIP_CODE}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('city')}
                    placeholder={localizations.LABEL_CITY}
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('state')}
                    placeholder={localizations.LABEL_STATE}
                  />
                </Grid>
                <Grid item className={classes.item} xs={4}>
                  <TextField
                    {...textFieldProps('country')}
                    placeholder={localizations.LABEL_COUNTRY}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">
                {localizations.PERSONAL_DETAILS_EXPLANATION}
              </Typography>

              <Grid container className={classes.mt2}>
                <Grid item className={classes.item} xs={6}>
                  <StyledButtonOutlined onClick={abort}>
                    {localizations.CANCEL}
                  </StyledButtonOutlined>
                </Grid>
                <Grid
                  item
                  className={classes.item + ' ' + classes.justifyContentFlexEnd}
                  xs={6}
                >
                  <StyledButton type="submit" onClick={handleSubmit}>
                    {localizations.CONFIRM}
                  </StyledButton>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </form>
      </div>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      className={classes.body}
      disableAutoFocus={true}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => ({
  profile: getLoggedInProfile(state),
  profileDetails: getLoggedInProfileDetails(state)
});

const dispatchToProps = {
  selectView,
  updateProfile
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(CompleteProfileModal);
