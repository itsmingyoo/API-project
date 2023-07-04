import { csrfFetch } from "./csrf";

// action names
const CREATE_SPOT_ACTION = "spots/createSpotAction";
const GET_SPOTS_ACTION = "spots/getSpotsAction";
const GET_SPOT_ID_ACTION = "spots/getSpotIdAction";
const GET_REVIEWS_ACTION = "spots/getReviewsAction";

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

const getReviewsAction = (reviews) => {
  return {
    type: GET_REVIEWS_ACTION,
    reviews,
  };
};

const createSpotAction = (formData) => {
  return {
    type: CREATE_SPOT_ACTION,
    formData,
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
  dispatch(getSpotIdAction(data));
  return res;
};

export const thunkCreateSpot = (formData) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    formData;
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    }),
  });

  const data = await res.json();
  dispatch(createSpotAction(data));
  return res;
};

export const thunkGetReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  dispatch(getReviewsAction(data));
  return res;
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
      return newState;
    }
    case GET_REVIEWS_ACTION: {
      newState = { ...state, Reviews: [] };
      action.reviews.forEach((review) => newState.Reviews.push(review));
      return newState;
    }
    case CREATE_SPOT_ACTION: {
      newState = { ...state, [action.formData.id]: { ...action.formData } };
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
