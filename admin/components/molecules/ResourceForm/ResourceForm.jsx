import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Form } from "semantic-ui-react";

import {
  fetchCurrentResourceRequest,
  submitResourceRequest,
  updateResourceElementRequest
} from "../../../ducks/resource";
import { selectMetadataClient } from "../../../selectors/metadata";
import {
  selectResourceCurrentEntity,
  selectResourceErrors,
  selectResourceVerboseName
} from "../../../selectors/resource";
import PolymorphicInput from "../../atoms/PolymorphicInput/PolymorphicInput";

const propTypes = {
  schema: PropTypes.object,
  fetchResource: PropTypes.func,
  updateResourceElement: PropTypes.func,
  submitResource: PropTypes.func,
  verboseName: PropTypes.string,
  currentEntity: PropTypes.object,
  resourceId: PropTypes.string,
  resourceName: PropTypes.string.isRequired
};
const defaultProps = {};

class ResourceForm extends React.Component {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {};
  }

  componentDidMount() {
    const { resourceId, resourceName } = this.props;

    if (resourceId) {
      this.props.fetchResource({ resourceName, resourceId });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentEntity === null && this.props.currentEntity !== null) {
      const { currentEntity } = this.props;
      const writableFields = Object.keys(this.writableFields);

      let data = Object.entries(currentEntity).filter(([key, value]) => writableFields.includes(key));
      data = Object.assign(...data.map(([key, value]) => ({ [key]: value })));
      this.setState({ ...this.state, ...data });
    }
  }

  get resourceSchema() {
    const { resourceName, schema } = this.props;

    return schema && schema.spec.paths[`/${resourceName}/`];
  }

  get fields() {
    const { properties: getProps, required: getRequired } = this.resourceSchema.get.responses["200"].content[
      "application/json"
    ].schema.items;
    const { properties: postProps, required: postRequired } = this.resourceSchema.post.requestBody.content[
      "application/json"
    ].schema;

    const getFields = Object.entries(getProps).map(([key, value]) => {
      const field = value;
      field.readOnly = true;
      field.required = getRequired.includes(key);
      return [key, field];
    });

    const postFields = Object.entries(postProps).map(([key, value]) => {
      const field = value;
      field.readOnly = false;
      field.required = postRequired.includes(key);
      return [key, field];
    });

    return Object.assign(
      ...getFields.map(([key, value]) => ({ [key]: value })),
      ...postFields.map(([key, value]) => ({ [key]: value }))
    );
  }

  get readOnlyFields() {
    const fields = Object.entries(this.fields).filter(([key, value]) => value.readOnly);
    return Object.assign(...fields.map(([key, value]) => ({ [key]: value })));
  }

  get writableFields() {
    const fields = Object.entries(this.fields).filter(([key, value]) => !value.readOnly);
    return Object.assign(...fields.map(([key, value]) => ({ [key]: value })));
  }

  getValue(name) {
    const { currentEntity } = this.props;

    let value = null;

    if (name in this.state) {
      value = this.state[name];
    } else if (currentEntity) {
      value = currentEntity[name];
    }

    return value || "";
  }

  handleChange(e, { name, value }) {
    this.setState({ ...this.state, [name]: value });
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { resourceId, resourceName, updateResourceElement, submitResource } = this.props;

    if (resourceId) {
      updateResourceElement({ resourceName, resourceId, resourceData: this.state });
    } else {
      submitResource({ resourceName, resourceData: this.state });
    }
  }

  render() {
    const { resourceId } = this.props;

    const fields = resourceId === null ? this.writableFields : this.fields;

    return (
      <Form onSubmit={this.handleSubmit}>
        {Object.entries(fields).map(([name, field]) => (
          <PolymorphicInput
            key={name}
            name={name}
            type={field.type}
            format={field.format}
            label={field.description || field.title || name}
            placeholder={field.default}
            value={this.getValue(name)}
            required={!field.readOnly && field.required}
            readOnly={field.readOnly}
            onChange={this.handleChange}
          />
        ))}
        <Form.Button content="Save" positive />
      </Form>
    );
  }
}

ResourceForm.propTypes = propTypes;
ResourceForm.defaultProps = defaultProps;

const mapStateToProps = state => ({
  schema: selectMetadataClient(state),
  verboseName: selectResourceVerboseName(state),
  currentEntity: selectResourceCurrentEntity(state),
  errors: selectResourceErrors(state)
});

const mapDispatchToProps = {
  fetchResource: fetchCurrentResourceRequest,
  submitResource: submitResourceRequest,
  updateResourceElement: updateResourceElementRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceForm);
