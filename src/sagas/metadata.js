import { call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_METADATA_REQUEST,
  fetchMetadataSuccess,
} from '../ducks/metadata';
import Api from '../api';

function* fetchMetadata() {
  try {
    const metadata = yield call(Api.fetchMetadata);
    const client = yield call(Api.fetchSwaggerSchema, metadata.schema);
    yield put(
      fetchMetadataSuccess({
        ...metadata,
        client,
      })
    );
  } catch (error) {
    throw Error(error);
  }
}

export default function* watchMetadata() {
  yield takeLatest(FETCH_METADATA_REQUEST, fetchMetadata);
}
