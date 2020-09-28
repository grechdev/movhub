import { SET_LOADER } from './types';

const initialState = {
  loader: false,
};

const loaderReducer = (state = initialState, action) => {
  const { type, loader } = action;

  switch (type) {
    case SET_LOADER:
      return { ...state, loader };
    default:
      return state;
  }
};

export default loaderReducer;
