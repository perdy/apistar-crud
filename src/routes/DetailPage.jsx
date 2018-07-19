import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ResourceForm from '../components/ResourceForm';
import { fetchCurrentResourceRequest } from '../ducks/resource';

const propTypes = {
  metadata: PropTypes.shape({
    resources: PropTypes.object,
    client: PropTypes.object,
    schema: PropTypes.string,
  }),
};

class DetailPage extends React.Component {
  componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      this.props.fetchResource({
        resourceName: this.props.match.params.resource,
        resourceId: this.props.match.params.id,
      });
    }
  }

  render() {
    const resourceName = this.props.match.params.resource;
    const resourceId = this.props.match.params.id;

    return <ResourceForm resourceName={resourceName} resourceId={resourceId} />;
  }
}

DetailPage.propTypes = propTypes;

const mapStateToProps = state => ({
  metadata: state.metadata,
});

const mapDispatchToProps = {
  fetchResource: fetchCurrentResourceRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailPage);
