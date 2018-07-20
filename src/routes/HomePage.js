import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

const propTypes = {
  metadata: PropTypes.shape({
    resources: PropTypes.object,
    schema: PropTypes.string,
    client: PropTypes.object,
  }),
};

class HomePage extends React.Component {
  render() {
    const { resources } = this.props.metadata;
    return (
      resources && (
        <Grid container alignItems="center">
          <Grid item xs={12} sm={6}>
            <Paper square>
              <Typography variant="title" className="PanelTitle">
                Resources
              </Typography>
              <List component="nav">
                {Object.entries(resources).map(resource => (
                  <ListItem
                    button
                    component={props => (
                      <Link
                        to={resource[1].replace('/admin/', '')} // TODO: Temp until I get the proper name
                        key={resource[0]}
                        {...props}
                      />
                    )}
                  >
                    <ListItemText primary={resource[0]} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )
    );
  }
}

HomePage.propTypes = propTypes;

const mapStateToProps = state => ({
  metadata: state.metadata,
});

export default connect(mapStateToProps)(HomePage);
