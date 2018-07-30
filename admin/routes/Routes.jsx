import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import HomePage from "../components/pages/HomePage";
import ListPage from "../components/pages/ListPage";
import DetailPage from "../components/pages/DetailPage";
import ErrorInternalServerPage from "../components/pages/ErrorInternalServerPage";
import ErrorNotFoundPage from "../components/pages/ErrorNotFoundPage";

const propTypes = {
  url: PropTypes.string
};

export default class Routes extends Component {
  render() {
    const { url } = this.props;

    if (url) {
      return (
        <Switch>
          <Route exact path={url} component={HomePage} />
          <Route exact path={`${url}:resource/`} component={ListPage} />
          <Route exact path={`${url}:resource/:id/`} component={DetailPage} />
          <Route path="/404/" component={ErrorNotFoundPage} />
          <Route path="/500/" component={ErrorInternalServerPage} />
        </Switch>
      );
    }

    return null;
  }
}

Routes.propTypes = propTypes;
