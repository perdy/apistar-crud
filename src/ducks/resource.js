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

const initialState = {
  entities: null,
  currentResourceElement: null,
};

export default handleActions(
  {
    [FETCH_RESOURCE_ENTITIES_SUCCESS]: (state, { payload }) => ({
      ...state,
      entities: payload,
      currentResourceElement: null,
    }),
    [FETCH_CURRENT_RESOURCE_SUCCESS]: (state, { payload }) => ({
      ...state,
      currentResourceElement: payload,
    }),
    [SUBMIT_RESOURCE_SUCCESS]: (state, { payload }) => ({
      ...state,
      entities: [...state.entities, payload],
    }),
    [SET_CURRENT_RESOURCE_ELEMENT]: (state, { payload }) => ({
      ...state,
      currentResourceElement: { ...state.currentResourceElement, ...payload },
    }),
  },
  initialState
);
