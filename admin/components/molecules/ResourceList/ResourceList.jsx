import { orderBy } from "lodash/collection";
import { isEmpty } from "lodash/lang";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Pagination, Segment, Table } from "semantic-ui-react";
import { fetchResourceEntitiesRequest } from "../../../ducks/resource";
import { selectMetadataAdmin } from "../../../selectors/metadata";
import {
  selectResourceCurrentPage,
  selectResourceEntities,
  selectResourceRowsPerPage,
  selectResourceTotalCount
} from "../../../selectors/resource";

const propTypes = {
  columns: PropTypes.object.isRequired,
  url: PropTypes.string,
  resourceName: PropTypes.string.isRequired,
  fetchResources: PropTypes.func.isRequired,
  resources: PropTypes.arrayOf(PropTypes.object),
  rowsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  totalCount: PropTypes.number
};

class ResourceList extends React.Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  get isEmpty() {
    const { resources } = this.props;
    return isEmpty(resources);
  }

  handlePageChange(event, { activePage }) {
    if (
      event &&
      activePage !== this.props.currentPage &&
      activePage > 0 &&
      activePage < this.props.totalCount / this.props.rowsPerPage
    ) {
      const { resourceName, rowsPerPage } = this.props;
      this.props.fetchResources({
        resourceName,
        query: {
          page: activePage,
          page_size: rowsPerPage
        }
      });
    }
  }

  renderEmpty() {
    return <Segment attached>No results found.</Segment>;
  }

  renderResources() {
    const { columns, currentPage, totalCount, rowsPerPage, resourceName, resources, url } = this.props;
    const sortedResources = orderBy(resources, ["id"], ["desc"]);

    return (
      <Table attached compact="very" striped singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            {Object.entries(columns).map(([k, v]) => (
              <Table.HeaderCell key={k}>{v.description || v.title || k}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedResources.map(item => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Link to={`${url}${resourceName}/${item.id}/`}>{item.id}</Link>
              </Table.Cell>
              {Object.keys(columns).map(field => <Table.Cell key={field}>{item[field]}</Table.Cell>)}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={Object.keys(columns).length + 1} textAlign="center">
              <Pagination
                activePage={currentPage}
                totalPages={totalCount / rowsPerPage}
                onPageChange={this.handlePageChange}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  render() {
    return this.isEmpty ? this.renderEmpty() : this.renderResources();
  }
}

ResourceList.propTypes = propTypes;

const mapStateToProps = state => ({
  url: selectMetadataAdmin(state),
  rowsPerPage: selectResourceRowsPerPage(state),
  currentPage: selectResourceCurrentPage(state),
  totalCount: selectResourceTotalCount(state),
  resources: selectResourceEntities(state)
});

const mapDispatchToProps = {
  fetchResources: fetchResourceEntitiesRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceList);
