import { csrfFetch } from "./csrf";

// action names
const CREATE_SPOT_ACTION = "spots/createSpotAction";
const GET_SPOTS_ACTION = "spots/getSpotsAction";
const GET_SPOT_ID_ACTION = "spots/getSpotIdAction";
const GET_USER_SPOTS_ACTION = "spots/getUserSpotsAction";
const UPDATE_USER_SPOT_ACTION = "spots/updateUserSpotAction";
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

const updateUserSpotAction = (userData, owner) => {
  return {
    type: UPDATE_USER_SPOT_ACTION,
    userData,
    owner,
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
  return data;
};

export const thunkCreateSpot =
  (formData, image, imageArray) => async (dispatch) => {
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

      for (let i = 0; i < imageArray.length; i++) {
        const image = imageArray[i];
        await csrfFetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          body: JSON.stringify({
            url: image,
            preview: false,
          }),
        });
      }

      await dispatch(createSpotAction(newSpot, newImage));
      return newSpot;
    } catch (e) {
      return await e.json();
    }
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
  dispatch(deleteUserSpotAction(spotId));
  return spotId;
};

export const thunkUpdateUserSpot =
  (spotId, updatedData) => async (dispatch) => {
    try {
      let newData = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      newData = await newData.json();

      let owner = await csrfFetch(`/api/spots/${spotId}`);
      owner = await owner.json();
      owner = await owner.Owner;
      // console.log("in the thunk - newData.json() ===> ", newData);
      // console.log("in the thunk - owner.json() ===> ", owner);
      dispatch(updateUserSpotAction(newData));
      return newData;
    } catch (e) {
      return await e.json();
    }
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
      // console.log("getspotid reducer, id grabbed was: ", action.spot);
      return newState;
    }
    case CREATE_SPOT_ACTION: {
      newState = {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: {
            ...action.payload,
            previewImage: action.image.url,
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
      console.log(`YOU ARE WORKING WITH THIS ===`, action.spot);
      delete newState.allSpots[action.spot];
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
    case UPDATE_USER_SPOT_ACTION: {
      newState = { ...state };
      // console.log("reducer new form data", action.userData);
      newState.allSpots[action.userData.id] = action.userData;
      newState.singleSpot = { Owner: { ...action.owner }, ...action.userData };
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
