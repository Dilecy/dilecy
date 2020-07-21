/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { localization } from '@dilecy/shared';

type ConsentState = {
  tracking: boolean;
  ux_research: boolean;
  accept_terms: boolean;
};
interface Props {
  consentState: ConsentState;
  onConsentChange: (consentState: ConsentState) => void;
}

export const Consent: React.FC<Props> = ({ consentState, onConsentChange }) => {
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => onConsentChange({ ...consentState, [name]: event.target.checked });
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={
              <Checkbox
                checked={consentState.tracking}
                onChange={handleChange('tracking')}
                color={'primary'}
                value="tracking"
              />
            }
            label={localization.CONSENT_USAGE_STATISTICS}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography color="textSecondary">
            {localization.CONSENT_USAGE_STATISTICS_DETAILS}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions2-content"
          id="additional-actions2-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={
              <Checkbox
                checked={consentState.ux_research}
                onChange={handleChange('ux_research')}
                color="primary"
                value="ux_research"
              />
            }
            label={localization.CONSENT_EMAIL}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography color="textSecondary">
            {localization.CONSENT_EMAIL_DETAILS}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions3-content"
          id="additional-actions3-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={
              <Checkbox
                checked={consentState.accept_terms}
                onChange={handleChange('accept_terms')}
                color={'primary'}
                value="accept_terms"
              />
            }
            label={localization.CONSENT_PRIVACY}
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography color="textSecondary">
              <Link
                href="https://dilecy.eu/datenschutzerklaerung/"
                target="_blank"
                rel="noopener"
              >
                Dilecy Datenschutzerklärung
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <Link
                href=" https://dilecy.eu/agb-prototyp/"
                target="_blank"
                rel="noopener"
              >
                Dilecy AGBs
              </Link>
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
