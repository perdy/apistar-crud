import React from 'react';

import { Toolbar, AppBar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import { REL_PATH } from '../../api';

class Header extends React.Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              <Link to={REL_PATH} className="HeaderLink">
                APISTAR UI
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metadata: state.metadata,
});

export default withTheme()(connect(mapStateToProps)(Header));
