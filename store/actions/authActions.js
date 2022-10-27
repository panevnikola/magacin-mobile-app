import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

import { API_URL_IP_NETWORK } from '../../constants/Variables';

export const STARTUP = 'STARTUP';
export const TRY_LOGIN = 'TRY_LOGIN';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';

let timer;

export const tryLogin = (token, user, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: TRY_LOGIN, token: token, user: user });
  };
};

export const startup = () => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(`${API_URL_IP_NETWORK}/login`);

      const resData = await response.json();

      console.log('startup resData ', resData);

      dispatch({
        type: STARTUP,
        user: resData,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const login = (username, password) => {
  console.log('login action ', username, password);
  return async (dispatch) => {
    const response = await fetch(`${API_URL_IP_NETWORK}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    console.log('response is ok ', response);

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'USERNAME_NOT_FOUND') {
        message = 'This username could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    console.log('login resData ', resData);

    const decoded = jwt_decode(resData.token);

    const expirationDate = decoded.exp;
    const user = {
      id: resData.id,
      username: resData.username,
      firstName: resData.firstName,
      lastName: resData.lastName,
      role: resData.role,
    };

    dispatch(setLogoutTimer(parseInt(decoded.exp)));
    dispatch({
      type: LOGIN,
      token: resData.token,
      user: user,
    });

    saveDataToStorage(resData.token, user, expirationDate);
  };
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const saveDataToStorage = (token, user, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      user: user,
      expirationDate: expirationDate
    })
  );
};
