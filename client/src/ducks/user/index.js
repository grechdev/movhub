import { LOG_OUT, SET_USER } from './types';

const initialState = {
  user: {},
};

const userReducer = (state = initialState, action) => {
  const { type, user } = action;

  switch (type) {
    case SET_USER:
      return { ...state, user };
    case LOG_OUT:
      return { ...state, user: {} };
    default:
      return state;
  }
};

export const setUser = user => ({
  type: SET_USER,
  user
});

export const logOut = () => ({ type: LOG_OUT });

export default userReducer;
