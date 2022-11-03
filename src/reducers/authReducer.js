import * as actionTypes from "../actions/types";

let token = localStorage.getItem('fr_token');

const initialState = token ? {
  isLoggedIn: true,
  user: { 'token': token }
} : {
  isLoggedIn: false,
  user: null,
  message : null
};

const authReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      newState.isLoggedIn = true;
      newState.user = action.user;
      newState.message = null;
      break;
    case actionTypes.LOGIN_FAILURE:
      newState.isLoggedIn = false;
      newState.message = action.message;
      break;
    case actionTypes.LOGOUT:
      newState.isLoggedIn = false;
      newState.user = null;
      newState.message = null;
      break;
    default:
      //Default
      break;  
  }
  return newState;
};

export default authReducer;