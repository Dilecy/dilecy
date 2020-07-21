import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import createTypography from '@material-ui/core/styles/createTypography';
import createPalette from '@material-ui/core/styles/createPalette';
import createStyles from '@material-ui/core/styles/createStyles';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import App from '../../App';

const customTheme = {
  colorPrimary: '#334395',
  colorSecondary: '#EBEBEB',
  colorAccent: '#707070',
  colorWarning: '#FF0000',
  colorWhite: '#FFFFFF',
  spacing: 3,
  spacingFactor: 8,
  fontSizeBodySmall: '0.75rem',
  fontSizeBodyLarge: '1rem',
  fontSizeH1: '1.5rem',
  fontSizeH2: '1.125rem',
  borderRadius: '1.125rem',
  shadow: '0px 0.25rem 0.5rem #00000029',
  containerWidth: '96.375rem',
  cardPadding: '1.5rem'
};

const themeProvider = createMuiTheme({
  palette: createPalette({
    primary: { main: customTheme.colorPrimary },
    secondary: { main: customTheme.colorSecondary },
    grey: {
      300: customTheme.colorSecondary,
      700: customTheme.colorAccent
    },
    background: { default: customTheme.colorSecondary },
    warning: { main: customTheme.colorWarning }
  }),
  typography: createTypography(createPalette({}), {
    fontFamily: 'Montserrat',
    button: {
      textTransform: 'none'
    }
  }),
  overrides: {
    MuiCheckbox: {
      colorSecondary: {
        '&$checked': {
          color: customTheme.colorPrimary
        }
      }
    },
    MuiTableCell: {
      root: {
        padding: '0.25rem 0.75rem'
      },
      paddingCheckbox: {
        padding: '0.4375rem',
        textAlign: 'center'
      }
    }
  }
});

const _root = () => {
  return (
    <MuiThemeProvider theme={themeProvider}>
      <App />
    </MuiThemeProvider>
  );
};

const ThemeRoot = withStyles(createStyles({}), { withTheme: true })(_root);

export { customTheme, themeProvider, ThemeRoot };
