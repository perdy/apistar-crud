import { connect } from 'react-redux';

import AppComponent from './App';

import { fetchMetadataRequest } from './ducks/metadata';

const mapStatetoProps = state => {
  return {};
};

const mapDispatchToProps = {
  fetchMetadata: fetchMetadataRequest,
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(AppComponent);
