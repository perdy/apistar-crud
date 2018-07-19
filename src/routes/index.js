import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import HomePage from './HomePage';
import ListPage from './ListPage';
import DetailPage from './DetailPage';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/admin/:resource" component={ListPage} />
            <Route exact path="/admin/:resource/:id" component={DetailPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
