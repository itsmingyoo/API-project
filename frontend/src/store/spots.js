import { csrfFetch } from "./csrf";

// action names
const GET_SPOTS_ACTION = "spots/getSpotsAction";
const GET_SPOT_ID = "spots/getSpotId";

// actions
const getSpotsAction = (spots) => {
  // console.log("getSpotsAction running");
  return {
    type: GET_SPOTS_ACTION,
    spots,
  };
};

const getSpotId = (spot) => {
  return {
    type: GET_SPOT_ID,
    spot,
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

export const thunkGetSpotId = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const data = await res.json();
  dispatch(getSpotId(data));
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
    case GET_SPOT_ID: {
      newState = { ...state };
      newState.spot = action.spot;
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
