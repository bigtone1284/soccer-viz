import { combineReducers } from 'redux';
import seasonReducer from './seasonReducer';

export default combineReducers({
  season: seasonReducer
});
