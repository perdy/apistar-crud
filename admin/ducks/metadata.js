import { createAction, handleActions } from "redux-actions";

// -TYPES
export const FETCH_METADATA_REQUEST = "metadata/fetch/REQUEST";
export const FETCH_METADATA_SUCCESS = "metadata/fetch/SUCCESS";
export const FETCH_METADATA_FAILURE = "metadata/fetch/FAILURE";

// -ACTIONS
export const fetchMetadataRequest = createAction(FETCH_METADATA_REQUEST);
export const fetchMetadataSuccess = createAction(FETCH_METADATA_SUCCESS);
export const fetchMetadataFailure = createAction(FETCH_METADATA_FAILURE);

// -STATE
const initialState = {
  resources: null,
  schema: null,
  client: null,
  admin: null
};

// -REDUCERS
export default handleActions(
  {
    [FETCH_METADATA_SUCCESS]: (state, { payload }) => ({ ...state, ...payload }),
    [FETCH_METADATA_FAILURE]: (state, { payload }) => ({ ...state, error: payload })
  },
  initialState
);
