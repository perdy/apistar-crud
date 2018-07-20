import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import HomePage from './HomePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import { REL_PATH } from '../api';

import { history } from '../index.js';
export default class Routes extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Grid className="MainContainer">
            <Switch>
              <Route exact path={REL_PATH} component={HomePage} />
              <Route exact path={`${REL_PATH}:resource`} component={ListPage} />
              <Route
                exact
                path={`${REL_PATH}:resource/:id`}
                component={DetailPage}
              />
            </Switch>
          </Grid>
        </div>
      </ConnectedRouter>
    );
  }
}
