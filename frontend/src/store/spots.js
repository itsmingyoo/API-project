import { csrfFetch } from "./csrf";

// action names
const CREATE_SPOT_ACTION = "spots/createSpotAction";
const GET_SPOTS_ACTION = "spots/getSpotsAction";
const GET_SPOT_ID_ACTION = "spots/getSpotIdAction";
const GET_SPOT_REVIEWS_ACTION = "spots/getReviewsAction";
const GET_USER_SPOTS_ACTION = "spots/getUserSpotsAction";
const DELETE_USER_SPOT_ACTION = "spots/deleteUserSpotAction";
const CLEAR_SPOT_DETAILS = "spots/clearSpotDetailsAction";

// actions
const getSpotsAction = (spots) => {
  // console.log("getSpotsAction running");
  return {
    type: GET_SPOTS_ACTION,
    spots,
  };
};

const getSpotIdAction = (spot) => {
  return {
    type: GET_SPOT_ID_ACTION,
    spot,
  };
};

const getSpotReviewsAction = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS_ACTION,
    reviews,
  };
};

const createSpotAction = (formData, image) => {
  return {
    type: CREATE_SPOT_ACTION,
    payload: formData,
    image,
  };
};

const getUserSpotsAction = (userSpots) => {
  // console.log("userspots action running");
  return {
    type: GET_USER_SPOTS_ACTION,
    userSpots,
  };
};

const deleteUserSpotAction = (spot) => {
  return {
    type: DELETE_USER_SPOT_ACTION,
    spot,
  };
};

// CLEANUP FUNCTION - DOESN'T REQUIRE A THUNK
export const clearSpotDetailsAction = () => {
  return { type: CLEAR_SPOT_DETAILS };
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
  dispatch(getSpotIdAction(data));
  return res;
};

export const thunkCreateSpot = (formData, image) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    // console.log("in the thunk image", image); //returns url
    const newSpot = await res.json();
    // console.log("in the thunk newSpot", newSpot);
    let newImage = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: "POST",
      body: JSON.stringify({
        url: image,
        preview: true,
      }),
    });

    newImage = await newImage.json();
    await dispatch(createSpotAction(newSpot, newImage));
    return newSpot;
  } catch (e) {
    return await e.json();
  }
};

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  dispatch(getSpotReviewsAction(data));
  return res;
};

export const thunkGetUserSpots = () => async (dispatch) => {
  let userSpots = await csrfFetch("/api/spots/current");
  userSpots = await userSpots.json();
  // console.log("this is the userSpots thunk after fetch", userSpots);
  // console.log("this is userId in the thunk parameter", userId);
  dispatch(getUserSpotsAction(userSpots));
  return userSpots;
};

export const thunkDeleteUserSpot = (spotId) => async (dispatch) => {
  let userSpot = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  userSpot = await userSpot.json();
  dispatch(deleteUserSpotAction(userSpot));
  return userSpot;
};

// reducer - initialState = spots : { fill in your kvp }
let initialState = {
  allSpots: {},
  singleSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS_ACTION: {
      newState = { ...state };
      action.spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;
    }
    case GET_SPOT_ID_ACTION: {
      newState = { ...state };
      newState.singleSpot = action.spot;
      console.log("getspotid reducer, id grabbed was: ", action.spot);
      return newState;
    }
    case GET_SPOT_REVIEWS_ACTION: {
      newState = { ...state, Reviews: [] };
      action.reviews.forEach((review) => newState.Reviews.push(review));
      return newState;
    }
    case CREATE_SPOT_ACTION: {
      newState = {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: {
            ...action.payload,
            previewImage: action.image,
          },
        },
      };
      return newState;
    }
    case GET_USER_SPOTS_ACTION: {
      newState = { ...state };
      // newState.ownerSpots = {};
      // action.userSpots.Spots.forEach(
      //   (spot) => (newState.ownerSpots[spot.id] = spot)
      // );
      newState.ownerSpots = [...action.userSpots.Spots];
      return newState;
    }
    case DELETE_USER_SPOT_ACTION: {
      newState = { ...state };
      delete newState.allSpots[action.spot.id];
      const indexToDelete = newState.ownerSpots.findIndex(
        (spot) => Number(spot.id) === Number(action.spot.id)
      );

      if (indexToDelete !== -1) {
        newState.ownerSpots.splice(indexToDelete, 1);
      }

      newState.singleSpot = {};
      return newState;
    }
    // NON-THUNK RESET-FUNCTION FOR SPOT-DETAILS
    case CLEAR_SPOT_DETAILS: {
      newState = { ...state };
      newState.singleSpot = {};
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
