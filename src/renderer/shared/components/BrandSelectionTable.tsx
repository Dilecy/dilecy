import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Brand } from '@dilecy/model';
import { IdMap } from '@dilecy/store';

const useStyles = makeStyles({
  table: {
    '& td:first-child, th:first-child': {
      width: '1.25rem'
    }
  },
  tableHeader: {
    '& th': {
      fontWeight: 'bold'
    },
    display: 'table',
    width: '100%',
    tableLayout: 'fixed'
  },
  tableBody: {
    ['& tr:nth-child(even)']: {
      backgroundColor: '#f3f3f3'
    },
    display: 'block',
    maxHeight: '21.875rem',
    overflowY: 'scroll',
    '& tr': {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed'
    }
  },
  selected: {
    backgroundColor: '#e5e5e5 !important'
  }
});

interface Props {
  brands: Brand[];
  selectedBrands: IdMap<boolean>;
  selectionCallback: (payload: { id: number; select: boolean }) => void;
}

const BrandSelectionTable: React.FC<Props> = ({
  brands,
  selectedBrands,
  selectionCallback
}) => {
  const classes = useStyles();
  return (
    <Table className={classes.table} size="small">
      <TableHead className={classes.tableHeader}>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Markenname</TableCell>
          <TableCell>Kategorien</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        {brands.map((brand: Brand) => (
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
            >
              <input
                readOnly
                type="checkbox"
                checked={selectedBrands[brand.id] ? true : false}
              ></input>
            </TableCell>
            <TableCell>{brand.name}</TableCell>
            <TableCell>{brand.formattedTags}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BrandSelectionTable;
