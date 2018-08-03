import { push } from "connected-react-router";
import { normalize } from "normalizr";
import { delay } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";
import Api from "../api";
import { fetchMetadataSuccess } from "../ducks/metadata";
import {
  DELETE_RESOURCE_ELEMENT_REQUEST,
  deleteResourceElementFailure,
  deleteResourceElementSuccess,
  FETCH_CURRENT_RESOURCE_REQUEST,
  FETCH_RESOURCE_ENTITIES_REQUEST,
  fetchCurrentResourceFailure,
  fetchCurrentResourceSuccess,
  fetchResourceEntitiesFailure,
  fetchResourceEntitiesSuccess,
  SUBMIT_RESOURCE_REQUEST,
  submitResourceFailure,
  submitResourceSuccess,
  UPDATE_RESOURCE_ELEMENT_REQUEST,
  updateResourceElementFailure
} from "../ducks/resource";
import Schema from "../schema";
import { selectMetadataAdmin, selectMetadataClient, selectMetadataResources } from "../selectors/metadata";

function* getSchema() {
  let client = yield select(selectMetadataClient);

  if (!client) {
    const metadata = yield call(Api.fetchMetadata);
    const { schema } = metadata;
    client = yield call(Api.fetchSwaggerSchema, schema);

    yield put(
      fetchMetadataSuccess({
        ...metadata,
        client
      })
    );
  }

  return client;
}

function* fetchResourceCollection({ payload }) {
  try {
    yield call(delay, 500);
    const client = yield call(getSchema);
    const resources = yield call(Api.fetchResourceCollection, payload, client);
    const entities = normalize(resources, { data: Schema.resourceCollection });

    const metadataResources = yield select(selectMetadataResources);
    const name = payload.resourceName;
    const verboseName = metadataResources[name].verbose_name;

    yield put(
      fetchResourceEntitiesSuccess({
        ids: entities.result.data,
        entities: entities.entities,
        name,
        verboseName,
        rowsPerPage: entities.result.meta.page_size,
        currentPage: entities.result.meta.page,
        totalCount: entities.result.meta.count
      })
    );
  } catch (error) {
    yield put(fetchResourceEntitiesFailure(error.message));

    if ("status" in error) {
      if (error.status === 404) {
        yield put(push("/404"));
      } else if (error.status >= 500) {
        yield put(push("/500"));
      }
    } else {
      console.error(error);
      yield put(push("/404"));
    }
  }
}

function* submitResourceElement({ payload }) {
  try {
    const client = yield getSchema();
    const resource = yield call(Api.submitResource, payload, client);
    const entities = normalize(resource, Schema.resource);

    yield put(
      submitResourceSuccess({
        currentEntity: entities.result,
        entities: entities.entities
      })
    );

    const url = yield select(selectMetadataAdmin);
    yield put(push(`${url}${payload.resourceName}/`));
  } catch (error) {
    yield put(submitResourceFailure(error));

    if ("status" in error) {
      if (error.status === 404) {
        yield put(push("/404"));
      } else if (error.status >= 500) {
        yield put(push("/500"));
      }
    }
  }
}

function* updateResourceElement({ payload }) {
  try {
    const client = yield select(selectMetadataClient);
    const resource = yield call(Api.updateResourceElement, payload, client);
    const entities = normalize(resource, Schema.resource);

    yield put(
      fetchCurrentResourceSuccess({
        currentEntity: entities.result,
        entities: entities.entities
      })
    );

    const url = yield select(selectMetadataAdmin);
    yield put(push(`${url}${payload.resourceName}/`));
  } catch (error) {
    yield put(updateResourceElementFailure(error));

    if ("status" in error) {
      if (error.status === 404) {
        yield put(push("/404"));
      } else if (error.status >= 500) {
        yield put(push("/500"));
      }
    }
  }
}

function* fetchResourceElement({ payload }) {
  try {
    const client = yield getSchema();
    const resource = yield call(Api.fetchResourceElement, payload, client);
    const entities = normalize(resource, Schema.resource);

    const metadataResources = yield select(selectMetadataResources);
    const name = payload.resourceName;
    const verboseName = metadataResources[name].verbose_name;

    yield put(
      fetchCurrentResourceSuccess({
        name,
        verboseName,
        currentEntity: entities.result,
        entities: entities.entities
      })
    );
  } catch (error) {
    yield put(fetchCurrentResourceFailure(error));

    if ("status" in error) {
      if (error.status === 404) {
        yield put(push("/404"));
      } else if (error.status >= 500) {
        yield put(push("/500"));
      }
    }
  }
}

function* deleteResourceElement({ payload }) {
  try {
    const client = yield getSchema();
    const response = yield call(Api.deleteResourceElement, payload, client);
    yield put(deleteResourceElementSuccess(payload));

    const url = yield select(selectMetadataAdmin);
    yield put(push(`${url}${payload.resourceName}/`));
  } catch (error) {
    yield put(deleteResourceElementFailure(error));

    if ("status" in error) {
      if (error.status === 404) {
        yield put(push("/404"));
      } else if (error.status >= 500) {
        yield put(push("/500"));
      }
    }
  }
}

export default function* watchResource() {
  yield takeLatest(FETCH_RESOURCE_ENTITIES_REQUEST, fetchResourceCollection);
  yield takeLatest(SUBMIT_RESOURCE_REQUEST, submitResourceElement);
  yield takeLatest(FETCH_CURRENT_RESOURCE_REQUEST, fetchResourceElement);
  yield takeLatest(UPDATE_RESOURCE_ELEMENT_REQUEST, updateResourceElement);
  yield takeLatest(DELETE_RESOURCE_ELEMENT_REQUEST, deleteResourceElement);
}
