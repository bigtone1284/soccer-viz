import { FETCH_SEASON } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_SEASON:
      return action.payload || null;
    default:
      return state;
  }
}
