import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectClient } from '../selectors/schema';
import { push } from 'react-router-redux';

import {
  FETCH_RESOURCE_ENTITIES_REQUEST,
  SUBMIT_RESOURCE_REQUEST,
  fetchResourceEntitiesSuccess,
  submitResourceSuccess,
  FETCH_CURRENT_RESOURCE_REQUEST,
  fetchCurrentResourceSuccess,
  UPDATE_RESOURCE_ELEMENT_REQUEST,
  updateResourceElementSuccess,
} from '../ducks/resource';
import Api from '../api';

function* fetchResource({ payload }) {
  try {
    let client = yield select(selectClient);
    if (!client) {
      const metadata = yield call(Api.fetchMetadata);
      const { schema } = metadata;
      client = yield call(Api.fetchSwaggerSchema, schema);
    }
    const resources = yield call(Api.fetchResource, payload, client);
    yield put(fetchResourceEntitiesSuccess(resources));
  } catch (error) {
    throw Error(error);
  }
}

function* submitResource({ payload }) {
  try {
    const client = yield select(selectClient);
    const response = yield call(Api.submitResource, payload, client);
    yield put(submitResourceSuccess(response));
    yield put(push(`${payload.resourceName}/${response.id}`));
  } catch (error) {
    throw Error(error);
  }
}

function* updateResourceElement({ payload }) {
  try {
    const client = yield select(selectClient);
    const response = yield call(Api.updateResourceElement, payload, client);
    yield put(updateResourceElementSuccess(response));
  } catch (error) {}
}

function* fetchResourceElement({ payload }) {
  try {
    let client = yield select(selectClient);
    if (!client) {
      const metadata = yield call(Api.fetchMetadata);
      const { schema } = metadata;
      client = yield call(Api.fetchSwaggerSchema, schema);
    }
    const resource = yield call(Api.fetchResourceElement, payload, client);
    yield put(fetchCurrentResourceSuccess(resource));
  } catch (error) {}
}

export default function* watchResource() {
  yield takeLatest(FETCH_RESOURCE_ENTITIES_REQUEST, fetchResource);
  yield takeLatest(SUBMIT_RESOURCE_REQUEST, submitResource);
  yield takeLatest(FETCH_CURRENT_RESOURCE_REQUEST, fetchResourceElement);
  yield takeLatest(UPDATE_RESOURCE_ELEMENT_REQUEST, updateResourceElement);
}
