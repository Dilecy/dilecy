import React from 'react';
import { connect, useDispatch } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { customTheme } from '@dilecy/shared/styles/theme';
import { BrowserHistoryState, BrandSelection } from '@dilecy/store/stateModel';
import { selectBrowserHistory, isBrowserHistoryLoading } from '../selectors';
import {
  browserHistoryConsent,
  validateNewRequestStep,
  startFetchingBrowserHistory,
  toggleRecommendedBrandSelected,
  selectAllRecommendedBrands,
  deselectAllRecommendedBrands
} from '../actions';
import { RootState } from 'typesafe-actions';
import {
  getRecommendedDomainsWithBrands,
  BrowserHistoryWithBrand
} from '@dilecy/store/selectors/newRequest';
import CustomDataTable from '@dilecy/shared/components/CustomDataTable';
import { StyledButtonOutlined } from '@dilecy/shared';
import { localization } from '@dilecy/shared';

interface Props {
  brandSelection: BrandSelection;
  browserHistory: BrowserHistoryState;
  browserHistoryData: BrowserHistoryWithBrand[];
  isBrowserHistoryLoading: boolean;
  browserHistoryConsent: typeof browserHistoryConsent;
  validateNewRequestStep: typeof validateNewRequestStep;
  startFetchingBrowserHistory: typeof startFetchingBrowserHistory;
  onBrowserHistoryConsentRevoked: () => void;
  toggleRecommendedBrandSelected: typeof toggleRecommendedBrandSelected;
  selectAllRecommendedBrands: typeof selectAllRecommendedBrands;
  deselectAllRecommendedBrands: typeof deselectAllRecommendedBrands;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(customTheme.spacing),
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& .MuiTypography-body2': {
      fontSize: customTheme.fontSizeBodyLarge,
      marginBottom: '1rem'
    },

    '& .MuiButton-root': {
      fontSize: customTheme.fontSizeBodyLarge
    }
  },
  formControl: {
    display: 'flex',
    alignItems: 'start',
    marginBottom: '1rem',
    width: '161px'
  },
  heading: {
    color: theme.palette.primary.main,
    textAlign: 'right',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '1.25rem',
    left: '2rem',
    zIndex: 2
  },
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '18.75rem'
  },
  inputLabel: {
    '&.MuiFormLabel-root': {
      fontSize: customTheme.fontSizeBodySmall,
      transform: 'scale(1)'
    }
  },
  filterContainer: {
    alignItems: 'center',
    display: 'flex'
  }
}));

interface Period {
  label: string;
  value: number;
}

enum PeriodTypes {
  ONE_DAY = '1 Tag',
  ONE_WEEK = '1 Woche',
  ONE_MONAT = '1 Monat',
  THREE_MONTHS = '3 Monate',
  SIX_MONTHS = '6 Monate',
  ONE_YEAR = '1 Jahr',
  UNILIMITED = 'unbeschänkt'
}

const netUnixTimeinMins = () => {
  return Math.floor(new Date().getTime() / 60000);
};

const periodList: Period[] = [
  { label: PeriodTypes.ONE_DAY, value: 1 * 24 * 60 },
  { label: PeriodTypes.ONE_WEEK, value: 1 * 24 * 60 * 7 },
  { label: PeriodTypes.ONE_MONAT, value: 1 * 24 * 60 * 30 },
  { label: PeriodTypes.THREE_MONTHS, value: 1 * 24 * 60 * 30 * 3 },
  { label: PeriodTypes.SIX_MONTHS, value: 1 * 24 * 60 * 30 * 6 },
  { label: PeriodTypes.ONE_YEAR, value: 1 * 24 * 60 * 365 },
  { label: PeriodTypes.UNILIMITED, value: netUnixTimeinMins() }
];

const SelectRecommendedBrandsStep: React.FC<Props> = ({
  validateNewRequestStep,
  browserHistoryConsent,
  browserHistory,
  browserHistoryData,
  isBrowserHistoryLoading,
  onBrowserHistoryConsentRevoked,
  startFetchingBrowserHistory,
  toggleRecommendedBrandSelected,
  selectAllRecommendedBrands,
  deselectAllRecommendedBrands,
  brandSelection
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [period, setPeriod] = React.useState(periodList[5].value); //setting default to 1 year

  React.useEffect(() => {
    //Add proper validations
    validateNewRequestStep({ recommendation: true });
  }, []);

  const handleSelectionChange = (
    rows: BrowserHistoryWithBrand[],
    rowData?: BrowserHistoryWithBrand
  ) => {
    //Single row toggle
    if (rowData && rowData.tableData) {
      toggleRecommendedBrandSelected({
        id: rowData.brandId || 0,
        selected: rowData.tableData.checked
      });
    } else if (rows && rows.length) {
      // select all
      const selectedRecommendedBrandIds = rows.map(brand => brand.brandId);
      selectAllRecommendedBrands(selectedRecommendedBrandIds);
    } else {
      // deselect all
      deselectAllRecommendedBrands();
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as number);
  };

  const consentFragment = () => (
    <React.Fragment>
      {!browserHistory.consent && (
        <Typography variant="body2" component="p">
          Anhand deines Browserverlaufs können Unternehmen identifiziert werden,
          die möglicherweise personenbezogene Daten von dir verarbeiten. Dilecy
          kann deinen Browserverlauf für dich automatisch auswerten, wenn du dem
          zustimmst. Dabei wird dein Browserverlauf nicht an uns gesendet, der
          Abgleich mit unserer Unternehmensdatenbank findet lokal statt.
        </Typography>
      )}
      <div className={classes.filterContainer}>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.inputLabel} htmlFor="period-select">
            Auszuwertender Zeitraum
          </InputLabel>
          <Select
            value={period}
            style={{ width: '9.735rem' }}
            onChange={handleChange}
          >
            {periodList.map((period, index) => (
              <MenuItem
                value={period.value}
                key={index}
                style={{ padding: '1rem' }}
              >
                {period.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div>
          <StyledButtonOutlined
            onClick={() => {
              deselectAllRecommendedBrands();
              browserHistoryConsent({
                consent: true,
                period: period
              });
              startFetchingBrowserHistory();
            }}
            color="primary"
            style={{ marginRight: '1rem' }}
          >
            {browserHistory.consent
              ? 'Erneut auswerten'
              : 'Ja, Browserverlauf auswerten'}
          </StyledButtonOutlined>
          <StyledButtonOutlined
            onClick={() => {
              deselectAllRecommendedBrands();
              const shouldRedirect = !browserHistory.consent;
              browserHistoryConsent({ consent: false, period: 0 });
              shouldRedirect && onBrowserHistoryConsentRevoked();
            }}
            color="primary"
          >
            {browserHistory.consent ? localization.RESET : 'Nein, Ablehnen'}
          </StyledButtonOutlined>
        </div>
      </div>
    </React.Fragment>
  );

  const brandTableFragment = () => (
    <React.Fragment>
      <div className={classes.headingContainer}>
        <Typography>Vorschläge basierend auf deinem Browserverlauf:</Typography>
        {brandSelection && Object.keys(brandSelection).length > 0 && (
          <Typography variant="subtitle2" className={classes.heading}>
            {Object.keys(brandSelection).length} Unternehmen ausgewählt
          </Typography>
        )}
      </div>

      <CustomDataTable
        title=""
        rootStyle={{ maxHeight: 'calc(100% - 2rem)', overflow: 'auto' }}
        columns={[
          { title: 'URL', field: 'url', filtering: false },
          {
            title: 'Zuletzt aufgerufen',
            field: 'last_accessed',
            filtering: false,
            customSort: (
              a: BrowserHistoryWithBrand,
              b: BrowserHistoryWithBrand
            ) => a.utc_time - b.utc_time
          }
        ]}
        rows={browserHistoryData}
        onSelectionChange={handleSelectionChange}
        selected={data => ({
          checked: data.selected || false
        })}
      />
    </React.Fragment>
  );

  const loading = () => (
    <Container className={classes.loading}>
      <CircularProgress />
    </Container>
  );

  return (
    <div className={classes.root}>
      {!isBrowserHistoryLoading && consentFragment()}
      {browserHistory.consent &&
        (isBrowserHistoryLoading ? loading() : brandTableFragment())}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  brandSelection: state.newRequestState.brandSelection,
  browserHistory: selectBrowserHistory(state),
  browserHistoryData: getRecommendedDomainsWithBrands(state),
  isBrowserHistoryLoading: isBrowserHistoryLoading(state)
});

const dispatchToProps = {
  toggleRecommendedBrandSelected,
  selectAllRecommendedBrands,
  deselectAllRecommendedBrands,
  browserHistoryConsent,
  validateNewRequestStep,
  startFetchingBrowserHistory
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(SelectRecommendedBrandsStep);
