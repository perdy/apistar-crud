import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';

import {
  submitResourceRequest,
  setCurrentResourceElement,
  updateResourceElementRequest,
  deleteResourceElementRequest,
} from '../../ducks/resource';

const propTypes = {
  schema: PropTypes.object,
  setCurrentResourceElement: PropTypes.func,
  updateResourceElement: PropTypes.func,
  submitResource: PropTypes.func,
  deleteResourceElement: PropTypes.func,
  resourceId: PropTypes.string,
  resourceName: PropTypes.string,
  currentResourceElement: PropTypes.object,
};
const defaultProps = {};

const typeMaps = {
  string: 'text',
  integer: 'number',
  float: 'number', // TODO: fix
  datetime: 'datetime', // TODO: fix
};

class ResourceForm extends React.Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDeleteConfirmClick = this.handleDeleteConfirmClick.bind(this);
    this.state = { data: null, isDialogOpen: false };
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

  handleDialogClose() {
    this.setState({ isDialogOpen: false });
  }

  handleDialogOpen() {
    this.setState({ isDialogOpen: true });
  }

  handleDeleteConfirmClick() {
    this.props.deleteResourceElement({
      resourceName: this.props.resourceName,
      resourceId: this.props.resourceId,
    });
  }

  render() {
    const data = this.props.currentResourceElement;
    const errors = this.props.errors;
    const resourceSchema =
      this.props.schema &&
      this.props.schema.spec.paths[`/${this.props.resourceName}/`].post
        .requestBody.content['application/json'].schema;
    const requiredFields = resourceSchema && resourceSchema.required;
    return resourceSchema ? (
      <form action="" onSubmit={this.handleSubmit}>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={12} sm={5}>
            {Object.entries(resourceSchema.properties).map(field => (
              <TextField
                key={field[1].title}
                error={
                  errors &&
                  (field[1].title
                    ? !!errors[field[1].title]
                    : !!errors[field[0]])
                }
                type={typeMaps[field[1].type] || 'text'}
                min={field[1].minimum}
                max={field[1].maximum}
                id={field[1].title || field[0]}
                label={field[1].description}
                name={field[1].title || field[0]}
                value={(data && (data[field[1].title] || data[field[0]])) || ''}
                onChange={this.handleInputChange}
                margin="normal"
                fullWidth
                required={requiredFields.includes(field[0])}
                helperText={
                  (errors &&
                    (field[1].title
                      ? errors[field[1].title]
                      : errors[field[0]])) ||
                  null
                }
              />
            ))}
            {this.props.resourceId !== 'new' && (
              <Button
                variant="contained"
                color="secondary"
                className="ButtonDelete"
                onClick={this.handleDialogOpen}
              >
                Delete
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="ButtonSave"
            >
              Save
            </Button>
            <Dialog
              open={this.state.isDialogOpen}
              onClose={this.handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this item?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleDeleteConfirmClick}
                  color="secondary"
                  variant="contained"
                  autoFocus
                >
                  Yes, Delete.
                </Button>
                <Button onClick={this.handleDialogClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
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
  deleteResourceElement: deleteResourceElementRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm);
