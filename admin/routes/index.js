import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Header from '../components/Header';
import HomePage from './HomePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import ErrorPage from './ErrorPage';

import { REL_PATH } from '../api';

import { history } from '../index.js';
export default class Routes extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Switch>
            <Route exact path={REL_PATH} component={HomePage} />
            <Route exact path={`${REL_PATH}:resource`} component={ListPage} />
            <Route
              exact
              path={`${REL_PATH}:resource/:id`}
              component={DetailPage}
            />
            <Route path="/not-found" component={ErrorPage} />
            <Route component={ErrorPage} />
          </Switch>
        </div>
      </ConnectedRouter>
    );
  }
}
