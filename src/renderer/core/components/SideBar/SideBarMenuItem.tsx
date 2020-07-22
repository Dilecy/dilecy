import React, { MouseEventHandler } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { selectView } from '../../actions';
import { RootState } from 'typesafe-actions';

interface Props {
  selectedView: string;
  selectView: typeof selectView | any;
  title: string;
  view?: Parameters<typeof selectView>[0] | undefined;
  className?: string;
  onClick?: MouseEventHandler;
  children?: React.ReactNode;
}

const _component = (props: Props) => (
  <ListItem
    button
    onClick={e => {
      props.onClick ? props.onClick(e) : props.selectView(props.view);
    }}
    selected={props.selectedView === props.view}
    className={props.className}
  >
    {props.children}
    <ListItemText primary={props.title} />
  </ListItem>
);

const mapStateToProps = (state: RootState) => ({
  selectedView: state.selectedView
});

const dispatchToProps = {
  selectView
};

const SideBarMenuItem = connect(
  mapStateToProps,
  dispatchToProps
)(_component);

export { SideBarMenuItem };
