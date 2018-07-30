import { orderBy } from "lodash/collection";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Dropdown, Input, Menu } from "semantic-ui-react";
import { fetchResourceEntitiesRequest } from "../../ducks/resource";
import { selectMetadataAdmin, selectMetadataClient, selectMetadataResources } from "../../selectors/metadata";
import {
  selectResourceCurrentPage,
  selectResourceIsFetching,
  selectResourceRowsPerPage
} from "../../selectors/resource";
import SegmentLoader from "../atoms/SegmentLoader";
import ResourceList from "../molecules/ResourceList";

const INVALID_PARAMS = ["page", "page_size"];
const PARAM_TYPE = "query";

const propTypes = {
  match: PropTypes.object,
  schema: PropTypes.object,
  resources: PropTypes.object,
  url: PropTypes.string,
  fetchResources: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  isFetching: PropTypes.bool
};

class ListPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = { filter: null, value: null, columnsOpen: false, columns: null };
  }

  componentDidMount() {
    const { currentPage, rowsPerPage } = this.props;

    this.props.fetchResources({
      resourceName: this.resourceName,
      query: {
        page_size: rowsPerPage,
        page: currentPage
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.schema !== null && (prevProps.schema === null || this.state.columns === null)) {
      const { resources } = this.props;

      this.setState({ ...this.state, columns: [...resources[this.resourceName].columns] });
    }
  }

  get resourceName() {
    const { match } = this.props;
    return match.params.resource;
  }

  get verboseName() {
    const { resources } = this.props;
    return resources[this.resourceName].verbose_name;
  }

  get filterParameters() {
    const { schema } = this.props;
    return schema.spec.paths[`/${this.resourceName}/`].get.parameters.filter(
      item => item.in === PARAM_TYPE && !INVALID_PARAMS.includes(item.name)
    );
  }

  get resourceSchema() {
    const { schema } = this.props;
    return schema && schema.spec.paths[`/${this.resourceName}/`].get;
  }

  get fields() {
    const fields = Object.entries(
      this.resourceSchema.responses["200"].content["application/json"].schema.items.properties
    );

    return Object.assign(
      ...orderBy(fields.filter(([k, v]) => k !== "id"), ["description"], ["asc"]).map(([k, v]) => ({ [k]: v }))
    );
  }

  get columns() {
    let { columns } = this.state;
    columns = columns || [];

    return Object.assign(...Object.entries(this.fields).map(([k, v]) => (columns.includes(k) ? { [k]: v } : {})));
  }

  handleChange(e, { name, value }) {
    this.setState({ ...this.state, [name]: value }, () => {
      const { filter, value: filterValue } = this.state;
      const { currentPage, rowsPerPage } = this.props;

      if (filter !== null && filterValue !== null) {
        this.props.fetchResources({
          resourceName: this.resourceName,
          query: {
            page_size: rowsPerPage,
            page: currentPage,
            [filter]: filterValue
          }
        });
      }
    });
  }

  handleSelect(e, { value }) {
    let { columns } = this.state;
    columns = columns || [];

    if (columns.includes(value)) {
      columns = columns.filter(item => item !== value);
    } else {
      columns.push(value);
    }

    this.setState({ ...this.state, columns: [...columns] });
  }

  renderMenu() {
    const { url } = this.props;

    const filterOptions = this.filterParameters.map(item => ({ key: item.name, text: item.name, value: item.name }));
    const columnsOptions = Object.entries(this.fields).map(([k, v]) => ({
      key: k,
      text: v.description || v.title || k,
      value: k
    }));

    const columns = this.columns;

    return (
      <Menu size="large" attached="top">
        <Menu.Item header>{this.verboseName}</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              name="value"
              onChange={this.handleChange}
              icon="filter"
              iconPosition="left"
              placeholder="Filter..."
              action={
                <Dropdown
                  onChange={this.handleChange}
                  name="filter"
                  placeholder="Filter"
                  compact
                  selection
                  search
                  options={filterOptions}
                />
              }
            />
          </Menu.Item>
          <Dropdown
            item
            name="columns"
            text="Columns"
            open={this.state.columnsOpen}
            onFocus={() => {
              this.setState({ ...this.state, columnsOpen: true });
            }}
            onBlur={() => {
              this.setState({ ...this.state, columnsOpen: false });
            }}
          >
            <Dropdown.Menu>
              <Dropdown.Header icon="columns" content="Columns" />
              <Dropdown.Menu scrolling>
                {columnsOptions.map(option => (
                  <Dropdown.Item
                    selected={option.value in columns}
                    onClick={this.handleSelect}
                    key={option.value}
                    {...option}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            <Button primary as={Link} to={`${url}${this.resourceName}/new/`}>
              Create
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  render() {
    const { isFetching, schema } = this.props;

    return (
      <React.Fragment>
        {schema && this.renderMenu()}
        {isFetching ? (
          <SegmentLoader attached />
        ) : (
          <ResourceList resourceName={this.resourceName} columns={this.columns} />
        )}
      </React.Fragment>
    );
  }
}

ListPage.propTypes = propTypes;

const mapStateToProps = state => ({
  schema: selectMetadataClient(state),
  resources: selectMetadataResources(state),
  url: selectMetadataAdmin(state),
  rowsPerPage: selectResourceRowsPerPage(state),
  currentPage: selectResourceCurrentPage(state),
  isFetching: selectResourceIsFetching(state)
});

const mapDispatchToProps = {
  fetchResources: fetchResourceEntitiesRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
