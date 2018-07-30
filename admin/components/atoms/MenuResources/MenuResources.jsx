import { isEmpty } from "lodash/lang";
import { pickBy } from "lodash/object";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown, Input } from "semantic-ui-react";
import { selectMetadataAdmin, selectMetadataResources } from "../../../selectors/metadata";
import { selectResourceName, selectResourceVerboseName } from "../../../selectors/resource";

const propTypes = {
  url: PropTypes.string,
  resources: PropTypes.object,
  resourceName: PropTypes.string,
  verboseName: PropTypes.string
};

const defaultProps = {};

class MenuResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resourceFilter: "" };
    this.renderResources = this.renderResources.bind(this);
  }

  get filteredResources() {
    const { resources } = this.props;
    const { resourceFilter } = this.state;

    return Object.assign(
      ...Object.entries(resources).filter(([key, value]) =>
        value.verbose_name.toLowerCase().includes(resourceFilter.toLowerCase())
      )
    );
  }

  renderResources() {
    const { url } = this.props;
    return Object.entries(this.filteredResources).map(([name, resource]) => (
      <Dropdown.Item key={name} as={Link} to={`${url}${name}/`}>
        {resource.verbose_name}
      </Dropdown.Item>
    ));
  }

  renderNoResults() {
    return <Dropdown.Item disabled>No resources found</Dropdown.Item>;
  }

  render() {
    const { verboseName } = this.props;

    return (
      <Dropdown item text={verboseName}>
        <Dropdown.Menu>
          <Input
            onChange={e => this.setState({ resourceFilter: e.target.value })}
            icon="search"
            iconPosition="left"
            placeholder="Resource"
          />
          <Dropdown.Divider />
          {isEmpty(this.filteredResources) ? this.renderNoResults() : this.renderResources()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

MenuResources.propTypes = propTypes;
MenuResources.defaultProps = defaultProps;

const mapStateToProps = state => ({
  url: selectMetadataAdmin(state),
  resources: selectMetadataResources(state),
  resourceName: selectResourceName(state),
  verboseName: selectResourceVerboseName(state)
});

export default connect(mapStateToProps)(MenuResources);
