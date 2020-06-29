import React from 'react';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';

import { Brand, Tag } from '../../../model/serverModel';
import { IdMap } from '../../../store/util/types';
import CustomTooltip from '../../../shared/components/CustomTooltip';
import StyledButton from '../../../shared/components/StyledButton';
import { SuggestBrand } from '../components/SuggestBrand';
import {
  setSelectSearchFilter,
  setBrandTagFilter,
  validateNewRequestStep,
  brandsRequested,
  recommendedBrandsRequested,
  toggleBrandSelected
} from '../actions';
import { RootState } from 'typesafe-actions';
import BrandSelectionTablePaginated from '../../../shared/components/BrandSelectionTablePaginated';
import { customTheme } from '../../../shared/styles/theme';
import { getBrandsByPageNumber } from '../selectors';
import { fromEvent } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';
import { BrandSelection } from '../../../store/stateModel';

const useStyles = makeStyles(theme => ({
  multiSelect: {
    width: '9.5rem',
    marginRight: '1.25rem'
  },
  heading: {
    color: theme.palette.primary.main,
    textAlign: 'right',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: ' 2.25rem',
    zIndex: 2,
    left: '2rem'
  },
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  toolbar: {
    color: 'rgba(0,0,0,0.54)',
    flexDirection: 'row',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    margin: '1rem 0',
    alignItems: ' flex-end',
    flexWrap: 'wrap'
  },
  root: {
    padding: theme.spacing(customTheme.spacing),
    flex: '1',
    display: 'flex',
    flexDirection: 'column',

    '& .MuiTablePagination-caption': {
      marginRight: '-11.875rem',
      fontSize: '1rem',
      fontFamily: 'Montserrat',
      fontWeight: '400',
      lineHeight: '1.5'
    },

    '& .MuiToolbar-root': {
      color: 'rgba(0,0,0,0.54)'
    },

    '& .MuiTablePagination-actions button:first-child': {
      marginRight: '7.8125rem'
    }
  },
  missingCompany: {
    marginLeft: 'auto',
    [theme.breakpoints.down('lg')]: {
      marginTop: '1rem'
    }
  },
  searchField: {
    display: 'inline-flex',
    color: 'rgba(0,0,0,0.54)',
    flexDirection: 'row',
    maxWidth: '18.75rem',

    '& .MuiInputBase-root': {
      color: 'rgba(0,0,0,0.54)'
    },

    '& #clear': {
      cursor: 'pointer'
    }
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 360
    }
  }
};

interface Props {
  selectSearchFilter: string;
  brandsByPageNumber: IdMap<Brand[]>;
  brandSelection: BrandSelection;
  setSelectSearchFilter: typeof setSelectSearchFilter;
  setBrandTagFilter: typeof setBrandTagFilter;
  tagFilter: number[];
  tags: IdMap<Tag>;
  validateNewRequestStep: typeof validateNewRequestStep;
  brandsRequested: typeof brandsRequested;
  isLoading: boolean;
  totalBrands: number;
  recommendedBrandsRequested: typeof recommendedBrandsRequested;
  toggleBrandSelected: typeof toggleBrandSelected;
}

const tooltip = `Hier kannst du Unternehmen für diese Anfragerunde auswählen. Um Unternehmen leichter zu finden kannst du nach Unternehmenskategorien
filtern oder nach einzelnen Unternehmen suchen. Alle Unternehmen erhalten den gleichen Anfragetext. Willst du Unternehmen 
unterschiedliche Anfragetexte schicken musst du dies in mehreren Anfragerunden machen. Du kannst Unternehmen auswählen, indem du im Kästchen links des Markennamens einen Haken setzt.`;

const SelectBrandsStep = (props: Props) => {
  const classes = useStyles();
  const {
    selectSearchFilter,
    brandSelection,
    setSelectSearchFilter,
    setBrandTagFilter,
    tagFilter,
    tags,
    validateNewRequestStep,
    brandsByPageNumber,
    brandsRequested,
    isLoading,
    totalBrands,
    recommendedBrandsRequested,
    toggleBrandSelected
  } = props;

  const [pageNumber, setPageNumber] = React.useState(0);
  const [brandsToDisplay, setBrandsToDisplay] = React.useState([] as Brand[]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPageNumber(newPage);
  };

  React.useEffect(() => {
    if (
      Object.values(brandSelection).filter(brand => brand.recommended).length
    ) {
      recommendedBrandsRequested();
    }
  }, []);

  React.useEffect(() => {
    const textField = document.getElementById('searchField') as FromEventTarget<
      React.FormEvent<HTMLInputElement>
    >;

    const input = document.getElementById('searchField') as HTMLInputElement;
    input.value = selectSearchFilter;

    const subscription = fromEvent(textField, 'keyup')
      .pipe(debounceTime(500))
      .subscribe((event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        setSelectSearchFilter(target.value);
        setPageNumber(0);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [selectSearchFilter]);

  React.useEffect(() => {
    const subscription = fromEvent(
      document.getElementById('clear') as FromEventTarget<
        React.FormEvent<HTMLInputElement>
      >,
      'click'
    ).subscribe(() => {
      setSelectSearchFilter('');
      const searchField = document.getElementById('searchField');
      if (searchField) {
        (searchField as any).value = '';
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [selectSearchFilter]);

  React.useEffect(() => {
    brandsRequested({ pageNumber: pageNumber + 1 }); //newPage starts from 0
  }, [pageNumber]);

  React.useEffect(() => {
    if (brandsByPageNumber[pageNumber + 1])
      setBrandsToDisplay(brandsByPageNumber[pageNumber + 1]);
  }, [brandsByPageNumber]);

  React.useEffect(() => {
    const selectedBrandValues = Object.values(brandSelection);
    if (selectedBrandValues.filter(value => !!value).length) {
      validateNewRequestStep({ select: true });
    } else {
      validateNewRequestStep({ select: false, text: false, summary: false });
    }
  }, [brandSelection]);

  const [suggestBrandVisible, setSuggestBrandVisible] = React.useState(false);
  return (
    <div className={classes.root}>
      <div className={classes.headingContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography style={{ marginRight: '1rem' }}>
            Wähle die Unternehmen aus, die diese Anfrage erhalten sollen:
          </Typography>
          <CustomTooltip content={tooltip} />
        </div>

        {brandSelection && Object.keys(brandSelection).length > 0 && (
          <Typography variant="subtitle2" className={classes.heading}>
            {Object.keys(brandSelection).length} Unternehmen ausgewählt
          </Typography>
        )}
      </div>

      <div className={classes.toolbar}>
        <FormControl>
          <InputLabel id="tags-label">Kategorien</InputLabel>
          <Select
            labelId="tags-label"
            multiple
            className={classes.multiSelect}
            value={tagFilter}
            onChange={event => {
              setBrandTagFilter(event.target.value as number[]);
              setPageNumber(0);
            }}
            renderValue={selected =>
              (selected as number[]).map(t => tags[t].name).join(', ')
            }
            input={<Input />}
            MenuProps={MenuProps}
          >
            {Object.values(tags).map(tag => (
              <MenuItem key={tag.id} value={tag.id}>
                <Checkbox
                  color="primary"
                  checked={tagFilter.indexOf(tag.id) > -1}
                />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.searchField}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Clear id="clear" />
                </InputAdornment>
              )
            }}
            placeholder="Suchtext"
            type="text"
            id="searchField"
          ></TextField>
        </div>

        <div className={classes.missingCompany}>
          <StyledButton
            onClick={() => {
              setSuggestBrandVisible(true);
            }}
          >
            Fehlendes Unternehmen?
          </StyledButton>
        </div>
      </div>

      <BrandSelectionTablePaginated
        brands={brandsToDisplay}
        selectedBrands={brandSelection}
        selectionCallback={payload =>
          toggleBrandSelected({ id: payload.id, selected: payload.select })
        }
        onPageChange={handlePageChange}
        currentPage={pageNumber}
        loading={isLoading}
        totalRecords={totalBrands}
      />

      <SuggestBrand
        open={suggestBrandVisible}
        setOpenSuggestBrand={setSuggestBrandVisible}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  tags: state.newRequestState.tags,
  tagFilter: state.newRequestState.tagFilter,
  selectSearchFilter: state.newRequestState.selectSearchFilter,
  brandsByPageNumber: getBrandsByPageNumber(state),
  brandSelection: state.newRequestState.brandSelection,
  isLoading: state.newRequestState.brands.loading,
  totalBrands: state.newRequestState.brands.totalCount
});

const dispatchToProps = {
  setSelectSearchFilter,
  setBrandTagFilter,
  validateNewRequestStep,
  brandsRequested,
  recommendedBrandsRequested,
  toggleBrandSelected
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(SelectBrandsStep);
