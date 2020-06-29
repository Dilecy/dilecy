/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Formik, Form } from 'formik';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import StyledButton from '../../../shared/components/StyledButton';
import StyledButtonOutlined from '../../../shared/components/StyledButtonOutlined';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

type ConsentState = { tracking: boolean; ux_research: boolean };

interface Props {
  showEditConsent: boolean;
  toggleEditConsentSettings: (event: boolean) => void;
  consentState: ConsentState;
  onConsentChange: (consentState: ConsentState) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

const consentData = {
  tracking: `Ja, ich stimme zu, dass die Dilecy GmbH mein Nutzungsverhalten mithilfe von
  Matomo Analytics trackt zu Marktforschungs und Produktentwicklungszwecken.`,
  ux_research: `Ja, ich stimme zu, dass meine E
  Mail Adresse an die Dilecy GmbH zur
  Kontaktaufnahme für Produktentwicklungszwecke übermittelt wird.`
};

const consentStatus = (status: boolean) =>
  status ? <CheckIcon /> : <CloseIcon />;

export const ConsentSettings: React.FC<Props> = ({
  showEditConsent,
  toggleEditConsentSettings,
  consentState,
  onConsentChange
}) => {
  const classes = useStyles();

  const [trackingChecked, setTrackingChecked] = React.useState(
    consentState.tracking
  );
  const [uxResearchChecked, setUxResearchChecked] = React.useState(
    consentState.ux_research
  );

  const handleChange = (name: keyof ConsentState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (name === 'tracking') {
      setTrackingChecked(event.target.checked);
    } else {
      setUxResearchChecked(event.target.checked);
    }
  };

  return (
    <>
      {!showEditConsent && (
        <Grid container spacing={2}>
          <Grid item xs={1}>
            {consentStatus(uxResearchChecked)}
          </Grid>
          <Grid item xs={11}>
            <Typography variant="body1">{consentData.ux_research}</Typography>
          </Grid>
          <Grid item xs={1}>
            {consentStatus(trackingChecked)}
          </Grid>
          <Grid item xs={11}>
            <Typography variant="body1">{consentData.tracking}</Typography>
          </Grid>
        </Grid>
      )}

      {showEditConsent && (
        <Formik
          initialValues={consentState}
          onSubmit={() => {
            onConsentChange({
              tracking: trackingChecked,
              ux_research: uxResearchChecked
            });
          }}
        >
          {() => (
            <Form className={classes.root} autoComplete="off">
              <FormControlLabel
                aria-label="Email Consent"
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                control={
                  <Checkbox
                    checked={uxResearchChecked}
                    onChange={handleChange('ux_research')}
                    value="tracking"
                  />
                }
                name="emailConsent"
                label={consentData.ux_research}
              />
              <FormControlLabel
                aria-label="Tracking Consent"
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                control={
                  <Checkbox
                    checked={trackingChecked}
                    onChange={handleChange('tracking')}
                    value="tracking"
                    color="primary"
                  />
                }
                name="trackingConsent"
                label={consentData.tracking}
              />
              <div>
                <Link
                  href="https://dilecy.eu/datenschutzerklaerung/"
                  target="_blank"
                  rel="noopener"
                >
                  Dilecy Datenschutzerklärung
                </Link>
              </div>
              <div>
                <Link
                  href=" https://dilecy.eu/agb-prototyp/"
                  target="_blank"
                  rel="noopener"
                >
                  Dilecy AGBs
                </Link>
              </div>

              <div
                style={{
                  display: 'flex',
                  marginTop: '1rem',
                  justifyContent: 'space-between'
                }}
              >
                <StyledButtonOutlined
                  type="reset"
                  onClick={() => toggleEditConsentSettings(showEditConsent)}
                >
                  Abbrechen
                </StyledButtonOutlined>
                <StyledButton type="submit">Änderungen speichern</StyledButton>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};
