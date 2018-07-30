import { isEmpty } from "lodash/lang";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu as SUIMenu } from "semantic-ui-react";
import { selectMetadataAdmin, selectMetadataClient } from "../../../selectors/metadata";
import { selectResourceCurrentEntity, selectResourceName } from "../../../selectors/resource";
import MenuResources from "../../atoms/MenuResources";

const propTypes = {
  url: PropTypes.string,
  schema: PropTypes.object,
  resourceName: PropTypes.string,
  currentEntity: PropTypes.object
};

const defaultProps = {};

class Menu extends React.Component {
  render() {
    const { schema, resourceName, currentEntity, url } = this.props;
    const title = (schema && schema.spec.info.title) || "API Star CRUD";

    return (
      <SUIMenu fixed="top" inverted>
        <SUIMenu.Item as="a" href="/" header>
          {title}
        </SUIMenu.Item>
        <SUIMenu.Item as={Link} to={`${url}`}>
          Admin
        </SUIMenu.Item>
        {resourceName && <MenuResources />}
        {!isEmpty(currentEntity) && <SUIMenu.Item as="a">{currentEntity.id}</SUIMenu.Item>}
      </SUIMenu>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

const mapStateToProps = state => ({
  url: selectMetadataAdmin(state),
  schema: selectMetadataClient(state),
  resourceName: selectResourceName(state),
  currentEntity: selectResourceCurrentEntity(state)
});

export default connect(mapStateToProps)(Menu);
