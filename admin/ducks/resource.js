import { combineActions, createAction, handleActions } from "redux-actions";

// -TYPES
export const FETCH_RESOURCE_ENTITIES_REQUEST = "resource/entities/fetch/REQUEST";
export const FETCH_RESOURCE_ENTITIES_SUCCESS = "resource/entities/fetch/SUCCESS";
export const FETCH_RESOURCE_ENTITIES_FAILURE = "resource/entities/fetch/FAILURE";

export const FETCH_CURRENT_RESOURCE_REQUEST = "resource/current-resource/REQUEST";
export const FETCH_CURRENT_RESOURCE_SUCCESS = "resource/current-resource/SUCCESS";
export const FETCH_CURRENT_RESOURCE_FAILURE = "resource/current-resource/FAILURE";

export const SUBMIT_RESOURCE_REQUEST = "resource/submit/REQUEST";
export const SUBMIT_RESOURCE_SUCCESS = "resource/submit/SUCCESS";
export const SUBMIT_RESOURCE_FAILURE = "resource/submit/FAILURE";

export const UPDATE_RESOURCE_ELEMENT_REQUEST = "resource/update/REQUEST";
export const UPDATE_RESOURCE_ELEMENT_SUCCESS = "resource/update/SUCCESS";
export const UPDATE_RESOURCE_ELEMENT_FAILURE = "resource/update/FAILURE";

export const DELETE_RESOURCE_ELEMENT_REQUEST = "resource/delete/REQUEST";
export const DELETE_RESOURCE_ELEMENT_SUCCESS = "resource/delete/SUCCESS";
export const DELETE_RESOURCE_ELEMENT_FAILURE = "resource/delete/FAILURE";

// -ACTIONS
export const fetchResourceEntitiesRequest = createAction(FETCH_RESOURCE_ENTITIES_REQUEST);
export const fetchResourceEntitiesSuccess = createAction(FETCH_RESOURCE_ENTITIES_SUCCESS);
export const fetchResourceEntitiesFailure = createAction(FETCH_RESOURCE_ENTITIES_FAILURE);

export const fetchCurrentResourceRequest = createAction(FETCH_CURRENT_RESOURCE_REQUEST);
export const fetchCurrentResourceSuccess = createAction(FETCH_CURRENT_RESOURCE_SUCCESS);
export const fetchCurrentResourceFailure = createAction(FETCH_CURRENT_RESOURCE_FAILURE);

export const submitResourceRequest = createAction(SUBMIT_RESOURCE_REQUEST);
export const submitResourceSuccess = createAction(SUBMIT_RESOURCE_SUCCESS);
export const submitResourceFailure = createAction(SUBMIT_RESOURCE_FAILURE);

export const updateResourceElementRequest = createAction(UPDATE_RESOURCE_ELEMENT_REQUEST);
export const updateResourceElementSuccess = createAction(UPDATE_RESOURCE_ELEMENT_SUCCESS);
export const updateResourceElementFailure = createAction(UPDATE_RESOURCE_ELEMENT_FAILURE);

export const deleteResourceElementRequest = createAction(DELETE_RESOURCE_ELEMENT_REQUEST);
export const deleteResourceElementSuccess = createAction(DELETE_RESOURCE_ELEMENT_SUCCESS);
export const deleteResourceElementFailure = createAction(DELETE_RESOURCE_ELEMENT_FAILURE);

// -STATE
const initialState = {
  ids: [],
  entities: {},
  name: null,
  verboseName: null,
  currentEntity: null,
  rowsPerPage: 10,
  totalCount: 0,
  currentPage: 1,
  errors: null,
  isFetching: false
};

// -REDUCERS
export default handleActions(
  {
    [FETCH_RESOURCE_ENTITIES_REQUEST]: state => ({ ...state, isFetching: true }),
    [FETCH_RESOURCE_ENTITIES_SUCCESS]: (
      state,
      { payload: { ids, entities, name, verboseName, rowsPerPage, totalCount, currentPage } }
    ) => ({
      ...state,
      currentEntity: null,
      ids: [...new Set([...ids])],
      entities: { ...entities },
      name,
      verboseName,
      rowsPerPage,
      totalCount,
      currentPage,
      isFetching: false
    }),
    [FETCH_CURRENT_RESOURCE_REQUEST]: state => ({ ...state, isFetching: false }),
    [FETCH_CURRENT_RESOURCE_SUCCESS]: (state, { payload: { name, verboseName, currentEntity, entities } }) => ({
      ...state,
      name,
      verboseName,
      currentEntity,
      ids: [...new Set([...state.entities, currentEntity])],
      entities: { ...state.entities, ...entities },
      isFetching: false
    }),
    [combineActions(SUBMIT_RESOURCE_SUCCESS, UPDATE_RESOURCE_ELEMENT_SUCCESS)]: (state, { payload: { entities } }) => ({
      ...state,
      entities: { ...state.entities, ...entities }
    }),
    [DELETE_RESOURCE_ELEMENT_SUCCESS]: (state, { payload: { resourceId } }) => ({
      ...state,
      entities: Object.assign(
        ...Object.entries(state.entities)
          .filter(([k]) => k != resourceId)
          .map(([k, v]) => ({ [k]: v }))
      ),
      ids: state.ids.filter(item => item != resourceId)
    }),
    [combineActions(
      FETCH_RESOURCE_ENTITIES_FAILURE,
      FETCH_CURRENT_RESOURCE_FAILURE,
      SUBMIT_RESOURCE_FAILURE,
      UPDATE_RESOURCE_ELEMENT_FAILURE,
      DELETE_RESOURCE_ELEMENT_FAILURE
    )]: (state, { payload }) => ({
      ...state,
      errors: payload,
      isFetching: false
    })
  },
  initialState
);
