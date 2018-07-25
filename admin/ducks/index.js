import { combineReducers } from 'redux';

import metadata from './metadata';
import resource from './resource';

export default combineReducers({
  metadata,
  resource,
});
