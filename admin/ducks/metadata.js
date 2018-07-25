import { createAction, handleActions } from 'redux-actions';

export const FETCH_METADATA_REQUEST = 'metadata/fetch/REQUEST';
export const FETCH_METADATA_SUCCESS = 'metadata/fetch/SUCCESS';
export const FETCH_METADATA_FAILURE = 'metadata/fetch/FAILURE';

export const fetchMetadataRequest = createAction(FETCH_METADATA_REQUEST);
export const fetchMetadataSuccess = createAction(FETCH_METADATA_SUCCESS);
export const fetchMetadataFailure = createAction(FETCH_METADATA_FAILURE);

const initialState = {
  resources: null,
  schema: null,
  client: null,
};

export default handleActions(
  {
    [FETCH_METADATA_SUCCESS]: (state, { payload }) => ({
      ...state,
      resources: payload.resources,
      schema: payload.schema,
      client: payload.client,
    }),
    [FETCH_METADATA_FAILURE]: (state, { payload }) => ({
      ...state,
      error: payload,
    }),
  },
  initialState
);
