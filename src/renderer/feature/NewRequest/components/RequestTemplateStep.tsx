import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {
  CustomTooltip,
  StyledButtonOutlined,
  localization
} from '@dilecy/shared';
import { customTheme } from '@dilecy/shared/styles/theme';
import { EmailTemplate } from '@dilecy/model';

import {
  getOriginalRequestTemplate,
  getMissingTemplateFields
} from '../selectors';
import {
  setRequestTemplateText,
  setRequestSubject,
  validateNewRequestStep
} from '../actions';
import { RootState } from 'typesafe-actions';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing(customTheme.spacing)
  },
  heading: {
    color: theme.palette.primary.main,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  resetButton: {
    maxWidth: '15rem',
    margin: '0 auto'
  },
  header: {
    marginRight: '1rem'
  },
  row: {
    marginTop: '1.25rem',
    marginBottom: '1.25rem'
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0',
    textAlign: 'left'
  },
  subjectField: { margin: '1.25rem 0' },
  templateField: {
    flex: 1,
    wordBreak: 'break-word',
    marginBottom: '1rem',

    '& .MuiInputBase-multiline legend': {
      width: '4.6875rem'
    },

    '& .MuiInputBase-multiline': {
      height: '100%',
      alignItems: 'flex-start',
      fontSize: customTheme.fontSizeBodySmall
    },

    '& .MuiInputBase-inputMultiline': {
      height: '100%'
    }
  }
}));

interface Props {
  requestSubject: string;
  requestTemplateText: string;
  originalTemplate?: EmailTemplate;
  missingTemplateFields: string[];
  setRequestTemplateText: typeof setRequestTemplateText;
  setRequestSubject: typeof setRequestSubject;
  validateNewRequestStep: typeof validateNewRequestStep;
}

const tooltip = `Du kannst Betreff und Text kontrollieren und selber bearbeiten. So erhalten Unternehmen genau die Anfrage, die sie von dir erhalten 
sollen. Alle Unternehmen in dieser Anfragerunde erhalten den gleichen Text als E-Mail von deiner E-Mailadresse.`;

const RequestTemplateStep: React.FC<Props> = (props: Props) => {
  const {
    requestTemplateText,
    requestSubject,
    originalTemplate,
    missingTemplateFields,
    setRequestTemplateText,
    setRequestSubject,
    validateNewRequestStep
  } = props;
  const classes = useStyles();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'subject') {
      setRequestSubject(event.target.value);
    } else {
      setRequestTemplateText(event.target.value);
    }
  };

  const validateStep = () => {
    if (
      requestTemplateText.trim().length > 0 &&
      requestSubject.trim().length > 0 &&
      missingTemplateFields.length === 0
    ) {
      validateNewRequestStep({ text: true });
    } else {
      validateNewRequestStep({ text: false });
    }
  };
  const applyTemplate = () => {
    if (requestTemplateText && requestSubject) return;
    if (originalTemplate) {
      setRequestTemplateText(originalTemplate.text);
      setRequestSubject(originalTemplate.subject);
    }
  };

  const resetTemplate = () => {
    if (originalTemplate) {
      setRequestTemplateText(originalTemplate.text);
      setRequestSubject(originalTemplate.subject);
    }
  };

  React.useEffect(applyTemplate, []);

  React.useEffect(validateStep, [requestTemplateText, requestSubject]);

  const errors =
    missingTemplateFields.length > 0
      ? {
          error: true,
          helperText: `Folgende variablen fehlen im Mustertext: ${missingTemplateFields.join(
            ','
          )}`
        }
      : {};

  return (
    <div className={classes.root}>
      <div className={classes.headingContainer}>
        <div style={{ display: 'flex' }}>
          <Typography className={classes.header}>
            Kontrolliere und bearbeite den Anfragetext:
          </Typography>
          <CustomTooltip content={tooltip} />
        </div>
      </div>
      <TextField
        className={classes.subjectField}
        value={requestSubject}
        onChange={handleOnChange}
        multiline
        name="subject"
        rowsMax={1}
        variant="outlined"
        label="Betreff"
      />
      <TextField
        className={classes.templateField}
        value={requestTemplateText}
        onChange={handleOnChange}
        multiline
        name="template"
        rows={10}
        variant="outlined"
        label="Mustertext"
        {...errors}
      />
      <StyledButtonOutlined
        className={classes.resetButton}
        onClick={resetTemplate}
      >
        {localization.RESET}
      </StyledButtonOutlined>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  requestSubject: state.newRequestState.requestSubject,
  requestTemplateText: state.newRequestState.requestTemplateText,
  originalTemplate: getOriginalRequestTemplate(state),
  missingTemplateFields: getMissingTemplateFields(state)
});

const dispatchToProps = {
  setRequestTemplateText,
  setRequestSubject,
  validateNewRequestStep
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(RequestTemplateStep);
