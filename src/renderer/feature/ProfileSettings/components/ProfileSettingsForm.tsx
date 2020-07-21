import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form, Formik, Field } from 'formik';
import React from 'react';
import { ProfileDetails } from '@dilecy/model/clientModel';
import { ChangePassword } from './ChangePassword';
import { SealedPassword } from '@dilecy/core/crypto/interface';
import { ProfileValidationSchema } from '@dilecy/shared/utils/validationSchema';
import { CustomInputField } from '@dilecy/shared/components/CustomInputField';
import { CustomDatePicker } from '@dilecy/shared/components/CustomDatePicker';
import { localization } from '@dilecy/shared';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > *': {
        margin: theme.spacing(1)
      },
      '& .MuiTextField-root': {
        width: '100%'
      }
    },
    profileData: {
      flex: '1'
    }
  })
);
interface Props {
  profileDetails: Partial<ProfileDetails>;
  showEditProfile: boolean;
  toggleEditProfile: (event: boolean) => void;
  updateProfile: (event: Partial<ProfileDetails>) => void;
  savedPasswordHash: string;
  updatePassword: (event: {
    oldPassword: SealedPassword;
    newPassword: SealedPassword;
  }) => void;
}

export const ProfileSettingsForm: React.FC<Props> = ({
  profileDetails,
  showEditProfile,
  toggleEditProfile,
  updateProfile,
  updatePassword,
  savedPasswordHash
}) => {
  const classes = useStyles();
  const [openChangePassword, setOpenChangePassword] = React.useState<boolean>(
    false
  );

  const defaultProfileDetails: Partial<ProfileDetails> = {
    profileName: profileDetails.profileName || '',
    firstName: profileDetails.firstName || '',
    lastName: profileDetails.lastName || '',
    dateOfBirth: profileDetails.dateOfBirth,
    houseNumber: profileDetails.houseNumber || '',
    streetName: profileDetails.streetName || '',
    zipCode: profileDetails.zipCode || '',
    city: profileDetails.city || '',
    state: profileDetails.state || '',
    country: profileDetails.country || ''
  };

  return (
    <React.Fragment>
      {!showEditProfile && (
        <div className={classes.profileData}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_PROFILE_NAME}
              </Typography>
              <Typography>{profileDetails.profileName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_FIRST_NAME}
              </Typography>
              <Typography>{profileDetails.firstName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_LAST_NAME}
              </Typography>
              <Typography>{profileDetails.lastName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_DATE_OF_BIRTH}
              </Typography>
              <Typography>{profileDetails.dateOfBirth}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_STREET_NAME}
              </Typography>
              <Typography>{profileDetails.streetName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_HOUSE_NUMBER}
              </Typography>
              <Typography>{profileDetails.houseNumber}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_ZIP_CODE}
              </Typography>
              <Typography>{profileDetails.zipCode}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_CITY}
              </Typography>
              <Typography>{profileDetails.city}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_STATE}
              </Typography>
              <Typography>{profileDetails.state}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption">
                {localization.LABEL_COUNTRY}
              </Typography>
              <Typography>{profileDetails.country}</Typography>
            </Grid>
          </Grid>
        </div>
      )}

      {showEditProfile && (
        <Formik
          initialValues={defaultProfileDetails}
          onSubmit={values => {
            toggleEditProfile(showEditProfile);
            updateProfile(values);
          }}
          validationSchema={ProfileValidationSchema}
        >
          {({ dirty }) => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Form className={classes.root} autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_PROFILE_NAME}
                      name="profileName"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_FIRST_NAME}
                      name="firstName"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_LAST_NAME}
                      name="lastName"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      required
                      name="dateOfBirth"
                      component={CustomDatePicker}
                      label={localization.LABEL_DATE_OF_BIRTH}
                      format="dd.MM.yyyy"
                      keyboard={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_STREET_NAME}
                      name="streetName"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_HOUSE_NUMBER}
                      name="houseNumber"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_ZIP_CODE}
                      name="zipCode"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_CITY}
                      name="city"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CustomInputField
                      placeholder={localization.LABEL_STATE}
                      name="state"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <CustomInputField placeholder="Land" name="country" />
                  </Grid>
                </Grid>

                <div
                  style={{
                    display: 'flex',
                    marginTop: '1rem',
                    justifyContent: 'space-between'
                  }}
                >
                  <StyledButtonOutlined
                    type="reset"
                    onClick={() => {
                      toggleEditProfile(showEditProfile);
                    }}
                  >
                    Abbrechen
                  </StyledButtonOutlined>
                  <StyledButtonOutlined
                    onClick={() => {
                      setOpenChangePassword(true);
                    }}
                  >
                    Passwort ändern
                  </StyledButtonOutlined>
                  <StyledButton type="submit" disabled={!dirty}>
                    Änderungen speichern
                  </StyledButton>
                </div>
              </Form>
            </MuiPickersUtilsProvider>
          )}
        </Formik>
      )}

      {/* Change Password Form */}
      <ChangePassword
        open={openChangePassword}
        updatePassword={updatePassword}
        setOpenChangePassword={(event: boolean) => {
          setOpenChangePassword(event);
        }}
        savedPasswordHash={savedPasswordHash}
      />
    </React.Fragment>
  );
};
