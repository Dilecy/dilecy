import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Brand } from '@dilecy/model';
import { IdMap } from '@dilecy/store';
import CircularProgress from '@material-ui/core/CircularProgress';
import { customTheme } from '../styles/theme';
import { BrandSelection } from '../../store/stateModel';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
    overflow: 'auto',
    position: 'relative',

    '& .MuiTableContainer-root': {
      maxHeight: '100%'
    },

    '& .MuiTable-root': {
      marginBottom: '3.25rem'
    },

    '& .MuiTablePagination-root': {
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      height: '3.25rem'
    },

    '& .MuiCheckbox-root': {
      padding: '0'
    }
  },
  container: {},
  selected: {
    backgroundColor: '#e5e5e5 !important'
  },
  loading: {
    display: 'table-cell',
    height: '12.5rem',
    textAlign: 'center'
  },
  tableBody: {
    '& .MuiTableCell-paddingCheckbox': {
      padding: '0.3rem'
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f2f2f2'
    },

    '& .MuiTableCell-root': {
      fontSize: customTheme.fontSizeBodySmall
    }
  }
}));

interface Props {
  brands: Brand[];
  selectedBrands: BrandSelection;
  selectionCallback: (payload: { id: number; select: boolean }) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  currentPage: number;
  loading: boolean;
  totalRecords: number;
}

const BrandSelectionTablePaginated: React.FC<Props> = ({
  brands,
  selectedBrands,
  selectionCallback,
  onPageChange,
  currentPage,
  loading,
  totalRecords
}) => {
  const classes = useStyles();
  const [rowsPerPage] = React.useState(100);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Markenname</TableCell>
              <TableCell>Kategorien</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {loading && (
              <TableRow>
                <TableCell className={classes.loading} colSpan={3}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              brands.map((brand: Brand) => (
                <TableRow
                  className={selectedBrands[brand.id] ? classes.selected : ''}
                  key={brand.id}
                >
                  <TableCell
                    onClick={() =>
                      selectionCallback({
                        id: brand.id,
                        select: !selectedBrands[brand.id]
                      })
                    }
                    padding="checkbox"
                  >
                    <Checkbox
                      readOnly
                      color="primary"
                      checked={selectedBrands[brand.id] ? true : false}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.formattedTags}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onChangePage={onPageChange}
      />
    </Paper>
  );
};

export { BrandSelectionTablePaginated };
