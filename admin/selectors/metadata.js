import { createSelector } from "reselect";

export const selectMetadata = state => state.metadata;
export const selectMetadataAdmin = createSelector(selectMetadata, state => state.admin);
export const selectMetadataSchema = createSelector(selectMetadata, state => state.schema);
export const selectMetadataClient = createSelector(selectMetadata, state => state.client);
export const selectMetadataResources = createSelector(selectMetadata, state => state.resources);
