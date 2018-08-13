import { FETCH_USER } from '../actions/types';

//inital state = null
export default function (state = null, action) {
    
    switch (action.type) {
        case FETCH_USER:
            //check if (empty string) then return false
            // ''||false = false
            return action.payload || false;

        default:
            return state;
    };
}