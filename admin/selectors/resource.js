import { denormalize } from "normalizr";
import { createSelector } from "reselect";
import Schema from "../schema";

export const selectResource = state => state.resource;
export const selectResourceIds = createSelector(selectResource, state => state.ids);
export const selectResourceEntities = createSelector(selectResource, state =>
  denormalize(state.ids, Schema.resourceCollection, state.entities)
);
export const selectResourceName = createSelector(selectResource, state => state.name);
export const selectResourceVerboseName = createSelector(selectResource, state => state.verboseName);
export const selectResourceCurrentEntity = createSelector(selectResource, state =>
  denormalize(state.currentEntity, Schema.resource, state.entities)
);
export const selectResourceRowsPerPage = createSelector(selectResource, state => state.rowsPerPage);
export const selectResourceTotalCount = createSelector(selectResource, state => state.totalCount);
export const selectResourceCurrentPage = createSelector(selectResource, state => state.currentPage);
export const selectResourceErrors = createSelector(selectResource, state => state.errors);
export const selectResourceIsFetching = createSelector(selectResource, state => state.isFetching);