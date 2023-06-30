// IMPORTS
import { csrfFetch } from "./csrf";

// DEFINE TYPE NAMES
const GET_CURRENT_USER = "session/getCurrentUser";
const REMOVE_CURRENT_USER = "session/removeCurrentUser";
// DEFINE ACTIONS
const getCurrentUserAction = (user) => {
  if (!user) return { user: null };
  return {
    type: GET_CURRENT_USER,
    user,
  };
};

const removeCurrentUserAction = () => {
  return {
    type: REMOVE_CURRENT_USER,
  };
};

// DEFINE THUNKS
export const thunkFetchUser =
  ({ credential, password }) =>
  async (dispatch) => {
    const res = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    const data = await res.json();
    dispatch(getCurrentUserAction(data.user));
    return res; // not sure why we're returning res here
  };

// not sure why we dont need a thunk to remove the current user
export const thunkRemoveUser = () => async (dispatch) => {
  const res = await fetch("/api/session");
  const data = await res.json();
  dispatch(removeCurrentUserAction(data.user));
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(getCurrentUserAction(data.user));
  return response;
};

// DEFINE REDUCER
const initialState = { user: null };
export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_USER: {
      const newState = { ...state, user: action.user };
      return newState;
    }
    case REMOVE_CURRENT_USER: {
      return initialState;
    }
    default:
      return state;
  }
}
