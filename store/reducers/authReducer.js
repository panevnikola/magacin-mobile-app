import {
  LOGIN,
  LOGOUT,
  STARTUP,
  REGISTER,
  TRY_LOGIN,
} from '../actions/authActions';

const initialState = {
  token: null,
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case STARTUP:
      return {
        ...state,
        user: action.user,
      };
    case TRY_LOGIN:
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    case LOGIN:
      return {
        ...state,
        token: action.token,
        user: action.user,
      };
    case REGISTER:
      return {
        ...state,
        token: action.token,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
