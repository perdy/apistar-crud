import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import ResourceForm from '../components/ResourceForm';

import { fetchResourceEntitiesRequest } from '../ducks/resource';
const propTypes = {
  match: PropTypes.object,
};

class ListPage extends React.Component {
  componentDidMount() {
    this.props.fetchResources(this.props.match.params.resource);
  }

  render() {
    const { resource } = this.props.match.params;
    const resourceSchema =
      this.props.schema &&
      this.props.schema.spec.paths[`/${resource}/`].post.requestBody.content[
        'application/json'
      ].schema;
    return (
      resourceSchema && (
        <div>
          <h1>List {this.props.match.params.resource}</h1>
          <Link to="new">
            <Button>New</Button>
          </Link>
          <Table>
            <TableHead>
              <TableRow>
                {Object.values(resourceSchema.properties).map(field => (
                  <TableCell>{field.description}</TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.resources &&
                this.props.resources.map(item => (
                  <TableRow>
                    {Object.values(resourceSchema.properties).map(field => (
                      <TableCell>{item[field.title]}</TableCell>
                    ))}
                    <TableCell>
                      <Link to={`${item.id}`}>view</Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )
    );
  }
}

ListPage.propTypes = propTypes;

const mapStateToProps = state => ({
  resources: state.resource.entities,
  schema: state.metadata.client,
});

const mapDispatchToProps = {
  fetchResources: fetchResourceEntitiesRequest,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
