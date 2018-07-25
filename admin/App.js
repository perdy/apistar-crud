import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Routes from './routes';

import './App.css';

const propTypes = {
  fetchMetadata: PropTypes.func.isRequired,
};

class App extends Component {
  componentDidMount() {
    this.props.fetchMetadata();
  }
  render() {
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}

App.propTypes = propTypes;

export default App;
