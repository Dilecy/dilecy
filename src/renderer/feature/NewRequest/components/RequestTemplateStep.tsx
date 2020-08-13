import React from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// TODO remove this tsc/lint exceptions by adding a type definition for tagify
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Tags from '@yaireo/tagify/dist/react.tagify';
import StyledbuttonOutlined from '../../../shared/components/StyledButtonOutlined';
import { EmailTemplate } from '../../../model/serverModel';
import CustomTooltip from '../../../shared/components/CustomTooltip';
import {
  getOriginalRequestTemplate,
  getMissingTemplateFields
} from '../selectors';
import {
  setRequestTemplateText,
  setRequestSubject,
  validateNewRequestStep
} from '../actions';
import { customTheme } from '../../../shared/styles/theme';
import { RootState } from 'typesafe-actions';
import { localization } from '../../../shared/localization';

const useStyles = makeStyles(theme => ({
  root: {
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
  // TODO: remove or replace the class templateField
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
  },
  // TODO: remove or conert the class templateField2 to templateField
  templateField2: {
    // make it look like the old component
    fontFamily: 'Montserrat',
    fontSize: '12px',
    padding: '18.5px 14px',
    borderRadius: '4px',
    border: '1px solid #cbcbcb',
    '&:hover': { border: '1px solid #3c3c3c' },
    '&:focus-within': { border: '1px solid #334395' }, // actually the border should be 2px when focussed but that creates a flickering

    // add scrollbars
    overflow: 'auto',

    // make tags look like in the mockup
    '& > span > tag': {
      minWidth: '200px'
    },
    '& > span > tag > div': {
      width: '100%',
      textAlign: 'center'
    },
    '& > span > tag > x': {
      display: 'none' // hiding the delete button is not supported in mixed mode
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

  const handleOnChangeTemplateText = React.useCallback(event => {
    event.persist();

    let templateText = event.target.value;
    templateText.split('{{ ').map((s1: string, i: number) => {
      if (!i) return;
      const s2 = s1.split(' }}');
      const json = s2[0];
      const field = JSON.parse(json).value;
      templateText = templateText.replace(
        `{{ {"value":"${field}"} }}`,
        `{{ ${field} }}`
      );

      setRequestTemplateText(templateText);
    });
  }, []);

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

  const tagSettings = {
    mode: 'mix',
    duplicates: true,
    mixTagsInterpolator: ['{{ ', ' }}'],
    editTags: false,
    autoComplete: {
      enabled: false
    },
    dropdown: {
      enabled: false
    }
  };

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
      {/* TODO Add a label, show errors*/}
      <Tags
        InputMode="textarea"
        settings={tagSettings}
        className={`${classes.templateField} ${classes.templateField2}`}
        value={requestTemplateText}
        name="templateText"
        onChange={handleOnChangeTemplateText}
        {...errors}
      />
      {/* TODO Remove the old TextField when done */}
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
      <StyledbuttonOutlined
        className={classes.resetButton}
        onClick={resetTemplate}
      >
        {localization.RESET}
      </StyledbuttonOutlined>
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
