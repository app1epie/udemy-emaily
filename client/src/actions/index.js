import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async (dispatch) => {
    var res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
};

// When Client receive response from strip, will fire to backend
// External API -> React's Action
export const handleToken = (token) => async(dispatch) =>{
    const res = await axios.post('/api/stripe', token);

    dispatch({ type: FETCH_USER, payload: res.data });
};