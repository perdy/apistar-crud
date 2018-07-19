import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const propTypes = {
  metadata: PropTypes.shape({
    resources: PropTypes.object,
    schema: PropTypes.object,
  }),
};

class HomePage extends React.Component {
  render() {
    const { resources } = this.props.metadata;
    return (
      resources && (
        <div>
          {Object.entries(resources).map(resource => (
            <Link to={resource[1]} key={resource[0]}>
              {resource[0]}
            </Link>
          ))}
        </div>
      )
    );
  }
}

HomePage.propTypes = propTypes;

const mapStateToProps = state => ({
  metadata: state.metadata,
});

export default connect(mapStateToProps)(HomePage);
