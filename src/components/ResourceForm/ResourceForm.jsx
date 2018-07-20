import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';

import {
  submitResourceRequest,
  setCurrentResourceElement,
  updateResourceElementRequest,
} from '../../ducks/resource';

const propTypes = {
  schema: PropTypes.object,
  setCurrentResourceElement: PropTypes.func,
  updateResourceElement: PropTypes.func,
  submitResource: PropTypes.func,
  resourceId: PropTypes.string,
  resourceName: PropTypes.string,
  currentResourceElement: PropTypes.object,
};
const defaultProps = {};

const typeMaps = {
  string: 'text',
  integer: 'number',
};
class ResourceForm extends React.Component {
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
    const errors = this.props.errors;
    const resourceSchema =
      this.props.schema &&
      this.props.schema.spec.paths[`/${this.props.resourceName}/`].post
        .requestBody.content['application/json'].schema;
    return resourceSchema ? (
      <form action="" onSubmit={this.handleSubmit}>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} sm={5}>
            {Object.values(resourceSchema.properties).map(field => (
              <TextField
                key={field.title}
                error={errors && !!errors[field.title]}
                type={typeMaps[field.type]}
                min={field.minimum}
                max={field.maximum}
                id={field.title}
                label={field.description}
                name={field.title}
                value={(data && data[field.title]) || ''}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                helperText={(errors && errors[field.title]) || null}
              />
            ))}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="ButtonSave"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    ) : (
      <div className="SpinnerContainer">
        <CircularProgress />
      </div>
    );
  }
}

ResourceForm.propTypes = propTypes;
ResourceForm.defaultProps = defaultProps;

const mapStateToProps = state => ({
  resources: state.resource.entities,
  schema: state.metadata.client,
  currentResourceElement: state.resource.currentResourceElement,
  errors: state.resource.errors,
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
