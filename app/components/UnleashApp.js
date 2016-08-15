import React, { PropTypes } from 'react';
import Menu from './Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red300 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  appBar: {
    color: red300,
  },
});

const UnleashApp = (props) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div>
      <Menu />
      <div style={styles.wrapper}>{props.children}</div>
    </div>
  </MuiThemeProvider>
);

const styles = {
  wrapper: {
    padding: '0 0 0 250px',
  },
};

UnleashApp.propTypes = {
  children: PropTypes.node,
};

export default UnleashApp;
