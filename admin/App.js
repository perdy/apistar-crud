import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import { ConnectedRouter } from "connected-react-router";

import "./App.css";
import Routes from "./routes";
import Menu from "./components/molecules/Menu";
import { fetchMetadataRequest } from "./ducks/metadata";
import { selectMetadataAdmin } from "./selectors/metadata";

const propTypes = {
  fetchMetadata: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  url: PropTypes.string
};

class App extends Component {
  componentDidMount() {
    this.props.fetchMetadata();
  }

  render() {
    const { url, history } = this.props;

    return (
      <ConnectedRouter history={history}>
        <div className="App">
          <Menu />
          <Container style={{ marginTop: "80px" }}>
            <Routes url={url} />
          </Container>
        </div>
      </ConnectedRouter>
    );
  }
}

App.propTypes = propTypes;

const mapStateToProps = state => ({
  url: selectMetadataAdmin(state)
});

const mapDispatchToProps = {
  fetchMetadata: fetchMetadataRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
