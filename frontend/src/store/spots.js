import { csrfFetch } from "./csrf";

// action names
const GET_SPOTS_ACTION = "spots/getSpotsAction";

// actions
const getSpotsAction = (spots) => {
  // console.log("getSpotsAction running");
  return {
    type: GET_SPOTS_ACTION,
    spots,
  };
};

// thunks
export const thunkGetSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  // console.log("this is the data", data);
  dispatch(getSpotsAction(data.Spots));
  return res;
};

// reducer
const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS_ACTION: {
      // console.log("get spots reducer", action);
      newState = {};
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      // console.log("all spots state", newState);
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
