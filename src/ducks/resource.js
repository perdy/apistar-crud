import { createAction, handleActions } from 'redux-actions';

export const FETCH_RESOURCE_ENTITIES_REQUEST =
  'resource/entities/fetch/REQUEST';
export const FETCH_RESOURCE_ENTITIES_SUCCESS =
  'resource/entities/fetch/SUCCESS';
export const FETCH_RESOURCE_ENTITIES_FAILURE =
  'resource/entities/fetch/FAILURE';

export const FETCH_CURRENT_RESOURCE_REQUEST =
  'resource/current-resource/REQUEST';
export const FETCH_CURRENT_RESOURCE_SUCCESS =
  'resource/current-resource/SUCCESS';
export const FETCH_CURRENT_RESOURCE_FAILURE =
  'resource/current-resource/FAILURE';

export const SUBMIT_RESOURCE_REQUEST = 'resource/submit/REQUEST';
export const SUBMIT_RESOURCE_SUCCESS = 'resource/submit/SUCCESS';
export const SUBMIT_RESOURCE_FAILURE = 'resource/submit/FAILURE';

export const UPDATE_RESOURCE_ELEMENT_REQUEST = 'resource/update/REQUEST';
export const UPDATE_RESOURCE_ELEMENT_SUCCESS = 'resource/update/SUCCESS';
export const UPDATE_RESOURCE_ELEMENT_FAILURE = 'resource/update/FAILURE';

export const SET_CURRENT_RESOURCE_ELEMENT = 'resource/current-resource/SET';

export const DELETE_RESOURCE_ELEMENT_REQUEST = 'resource/delete/REQUEST';

export const fetchResourceEntitiesRequest = createAction(
  FETCH_RESOURCE_ENTITIES_REQUEST
);
export const fetchResourceEntitiesSuccess = createAction(
  FETCH_RESOURCE_ENTITIES_SUCCESS
);
export const fetchCurrentResourceRequest = createAction(
  FETCH_CURRENT_RESOURCE_REQUEST
);
export const fetchCurrentResourceSuccess = createAction(
  FETCH_CURRENT_RESOURCE_SUCCESS
);

export const submitResourceRequest = createAction(SUBMIT_RESOURCE_REQUEST);
export const submitResourceSuccess = createAction(SUBMIT_RESOURCE_SUCCESS);
export const submitResourceFailure = createAction(SUBMIT_RESOURCE_FAILURE);
export const updateResourceElementRequest = createAction(
  UPDATE_RESOURCE_ELEMENT_REQUEST
);
export const updateResourceElementSuccess = createAction(
  UPDATE_RESOURCE_ELEMENT_SUCCESS
);
export const updateResourceElementFailure = createAction(
  UPDATE_RESOURCE_ELEMENT_FAILURE
);
export const setCurrentResourceElement = createAction(
  SET_CURRENT_RESOURCE_ELEMENT
);

export const deleteResourceElementRequest = createAction(
  DELETE_RESOURCE_ELEMENT_REQUEST
);

const initialState = {
  entities: null,
  currentResourceElement: null,
  rowsPerPage: null,
  totalCount: null,
  currentPage: null,
  errors: null,
};

export default handleActions(
  {
    [FETCH_RESOURCE_ENTITIES_SUCCESS]: (state, { payload }) => ({
      ...state,
      entities: payload.resources.data,
      currentResourceElement: null,
      rowsPerPage: payload.resources.meta.page_size,
      currentPage: payload.resources.meta.page,
      totalCount: payload.resources.meta.count,
    }),
    [FETCH_CURRENT_RESOURCE_SUCCESS]: (state, { payload }) => ({
      ...state,
      currentResourceElement: payload,
    }),
    [SUBMIT_RESOURCE_SUCCESS]: (state, { payload }) => ({
      ...state,
      entities: [...state.entities, payload],
      errors: null,
    }),
    [SUBMIT_RESOURCE_FAILURE]: (state, { payload }) => ({
      ...state,
      errors: payload,
    }),
    [SET_CURRENT_RESOURCE_ELEMENT]: (state, { payload }) => ({
      ...state,
      currentResourceElement: { ...state.currentResourceElement, ...payload },
    }),
  },
  initialState
);
