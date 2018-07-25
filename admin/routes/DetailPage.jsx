import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Grid, Button } from '@material-ui/core';

import { REL_PATH } from '../api';
import ResourceForm from '../components/ResourceForm';
import { fetchCurrentResourceRequest } from '../ducks/resource';

const propTypes = {
  metadata: PropTypes.shape({
    resources: PropTypes.object,
    client: PropTypes.object,
    schema: PropTypes.string,
  }),
  match: PropTypes.object,
  fetchResource: PropTypes.func.isRequired,
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

    return (
      <Grid container className="MainContainer">
        <Grid item xs={12}>
          <Button
            className="ButtonBack"
            component={props => (
              <Link to={`${REL_PATH}${resourceName}/`} {...props} />
            )}
          >
            <Icon>arrow_back</Icon>
            &nbsp;Back
          </Button>
          <ResourceForm resourceName={resourceName} resourceId={resourceId} />
        </Grid>
      </Grid>
    );
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
