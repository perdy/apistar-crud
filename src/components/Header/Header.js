import React from 'react';

import { Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    return (
      <div>
        <Toolbar>
          <div>
            <Link to="/">ANZU UI</Link>
          </div>
        </Toolbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metadata: state.metadata,
});

export default connect(mapStateToProps)(Header);
