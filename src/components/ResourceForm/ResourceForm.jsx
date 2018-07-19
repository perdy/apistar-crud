import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField, Button } from '@material-ui/core';

import {
  submitResourceRequest,
  setCurrentResourceElement,
  updateResourceElementRequest,
} from '../../ducks/resource';

const propTypes = {
  schema: PropTypes.object.isRequired,
};
const defaultProps = {};

class ResourceForm extends React.Component {
  static getDerivedStateFromProps(props, state) {
    return {
      data: props.currentResource,
    };
  }

  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { data: null };
  }

  handleInputChange(evt) {
    const { name, value } = evt.target;
    this.props.setCurrentResourceElement({ [name]: value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (this.props.resourceId !== 'new') {
      this.props.updateResourceElement({
        resourceName: this.props.resourceName,
        resourceData: this.props.currentResourceElement,
        resourceId: this.props.resourceId,
      });
    } else {
      this.props.submitResource({
        resourceName: this.props.resourceName,
        resourceData: this.props.currentResourceElement,
      });
    }
  }

  render() {
    const data = this.props.currentResourceElement;
    const resourceSchema =
      this.props.schema &&
      this.props.schema.spec.paths[`/${this.props.resourceName}/`].post
        .requestBody.content['application/json'].schema;
    return (
      resourceSchema && (
        <form action="" onSubmit={this.handleSubmit}>
          <Grid container alignItems="center">
            <Grid item xs={5}>
              {Object.values(resourceSchema.properties).map(field => (
                <TextField
                  key={field.title}
                  id={field.title}
                  label={field.description}
                  name={field.title}
                  value={(data && data[field.title]) || ''}
                  onChange={this.handleInputChange}
                  margin="normal"
                  fullWidth
                />
              ))}
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    );
  }
}

ResourceForm.propTypes = propTypes;
ResourceForm.defaultProps = defaultProps;

const mapStateToProps = state => ({
  resources: state.resource.entities,
  schema: state.metadata.client,
  currentResourceElement: state.resource.currentResourceElement,
});

const mapDispatchToProps = {
  submitResource: submitResourceRequest,
  setCurrentResourceElement,
  updateResourceElement: updateResourceElementRequest,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm);
