import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Button,
  Typography,
  Icon,
  CircularProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import { REL_PATH } from '../api';
import TablePaginationActions from '../components/TablePaginationActions';
import { fetchResourceEntitiesRequest } from '../ducks/resource';
const propTypes = {
  match: PropTypes.object,
  fetchResources: PropTypes.func,
  schema: PropTypes.PropTypes.object,
  resources: PropTypes.arrayOf(PropTypes.object),
  rowsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
};

const DEFAULT_PAGE_SIZE = 10;

class ListPage extends React.Component {
  constructor() {
    super();
    this.handleChangePage = this.handleChangePage.bind(this);
  }
  componentDidMount() {
    this.props.fetchResources({
      resourceName: this.props.match.params.resource,
      query: {
        page_size: DEFAULT_PAGE_SIZE,
        page: 1,
      },
    });
  }

  handleChangePage(evt, page) {
    this.props.fetchResources({
      resourceName: this.props.match.params.resource,
      query: {
        page: page,
        page_size: DEFAULT_PAGE_SIZE,
      },
    });
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
        <Paper square>
          <div>
            <Typography variant="title" className="TableTitle PanelTitle">
              {this.props.match.params.resource}
            </Typography>

            <Button
              component={props => <Link to="new" {...props} />}
              variant="contained"
              color="primary"
              className="ButtonNew"
            >
              Create New
            </Button>
            {this.props.resources ? (
              <Fragment>
                <div className="TableContainer">
                  <Table className="TableContainer">
                    <TableHead>
                      <TableRow>
                        <TableCell key="edit">Edit</TableCell>
                        {Object.values(resourceSchema.properties).map(field => (
                          <TableCell key={field.title}>
                            {field.description}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.props.resources.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link to={`${REL_PATH}${resource}/${item.id}`}>
                              <Icon>edit</Icon>
                            </Link>
                          </TableCell>
                          {Object.values(resourceSchema.properties).map(
                            field => <TableCell>{item[field.title]}</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow />
                    </TableFooter>
                  </Table>
                </div>
                <TablePagination
                  colSpan={3}
                  component="div"
                  count={this.props.resources.length}
                  rowsPerPage={this.props.rowsPerPage}
                  page={this.props.currentPage - 1}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </Fragment>
            ) : (
              <div className="SpinnerContainer">
                <CircularProgress />
              </div>
            )}
          </div>
        </Paper>
      )
    );
  }
}

ListPage.propTypes = propTypes;

const mapStateToProps = state => ({
  rowsPerPage: state.resource.rowsPerPage,
  currentPage: state.resource.currentPage,
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
