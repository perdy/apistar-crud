import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Button, Confirm, Icon, Menu, Segment } from "semantic-ui-react";
import { deleteResourceElementRequest } from "../../ducks/resource";
import { selectMetadataResources } from "../../selectors/metadata";
import ResourceForm from "../molecules/ResourceForm/ResourceForm";

const propTypes = {
  match: PropTypes.object,
  resources: PropTypes.object,
  deleteResourceElement: PropTypes.func
};

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.showDelete = this.showDelete.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);

    this.state = { isDeleteOpen: false };
  }

  get verboseName() {
    const { resources, match } = this.props;
    return resources[match.params.resource].verbose_name;
  }

  showDelete() {
    this.setState({ ...this.state, isDeleteOpen: true });
  }

  handleDeleteConfirm() {
    const { deleteResourceElement, match } = this.props;
    const { resource, id } = match.params;

    deleteResourceElement({ resourceName: resource, resourceId: id });

    this.setState({ ...this.state, isDeleteOpen: false });
  }

  handleDeleteCancel() {
    this.setState({ ...this.state, isDeleteOpen: false });
  }

  render() {
    const { isDeleteOpen } = this.state;
    const { match } = this.props;
    const { resource, id } = match.params;

    const resourceId = id === "new" ? null : id;

    return (
      <React.Fragment>
        <Menu attached="top">
          <Menu.Item header>{this.verboseName}</Menu.Item>
          {resourceId && <Menu.Item>{resourceId}</Menu.Item>}
          {resourceId && (
            <Menu.Menu position="right">
              <Menu.Item>
                <Button name="delete" onClick={this.showDelete} onKeyPress={this.showDelete} negative>
                  <Icon name="delete" />
                  Delete
                </Button>
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>

        <Segment attached>
          <ResourceForm resourceName={resource} resourceId={resourceId} attached />
        </Segment>

        {resourceId && (
          <Confirm
            open={isDeleteOpen}
            header={`Delete ${this.verboseName}`}
            content={`Are you sure you want to delete ${this.verboseName} (${resourceId})?`}
            onCancel={this.handleDeleteCancel}
            onConfirm={this.handleDeleteConfirm}
          />
        )}
      </React.Fragment>
    );
  }
}

DetailPage.propTypes = propTypes;

const mapStateToProps = state => ({
  resources: selectMetadataResources(state)
});

const mapDispatchToProps = {
  deleteResourceElement: deleteResourceElementRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailPage);
