import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { selectMetadataAdmin, selectMetadataResources } from "../../selectors/metadata";

const propTypes = {
  url: PropTypes.string,
  resources: PropTypes.object
};

const defaultProps = {
  resources: null
};

class HomePage extends React.Component {
  render() {
    const { resources } = this.props;

    return (
      resources && (
        <div>
          <Menu vertical fluid>
            <Menu.Item color="red" header>
              Resources
            </Menu.Item>
            {Object.entries(resources).map(([k, v]) => (
              <Menu.Item key={k} as={Link} to={`${k}/`} name={k}>
                {v.verbose_name}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      )
    );
  }
}

HomePage.propTypes = propTypes;
HomePage.defaultProps = defaultProps;

const mapStateToProps = state => ({
  resources: selectMetadataResources(state),
  url: selectMetadataAdmin(state)
});

export default connect(mapStateToProps)(HomePage);
