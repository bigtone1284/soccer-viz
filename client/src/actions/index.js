import axios from 'axios';
import { FETCH_SEASON, FETCH_SEASON_TEAMS } from './types';

export const fetchSeason = () => async dispatch => {
  const res = await axios.get('/api/season/445');
  let seasonObj = {};
  dispatch({ type: FETCH_SEASON, payload: res.data });
};
