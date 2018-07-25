import { all } from 'redux-saga/effects';

import watchMetadata from './metadata';
import watchResource from './resource';
export default function* root() {
  yield all([watchMetadata(), watchResource()]);
}
