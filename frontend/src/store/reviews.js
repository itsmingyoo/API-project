import { csrfFetch } from "./csrf";

const GET_SPOT_REVIEWS_ACTION = "reviews/getSpotReviewsAction";
const GET_USER_REVIEWS_ACTION = "reviews/getUserReviewsAction";
// reviews/current GET - done
// reviews/${review.id}/images POST
// reviews/${review.id} DELETE
// review-images/{reviewImage.id} DELETE

const getSpotReviewsAction = (reviews) => {
  return {
    type: GET_SPOT_REVIEWS_ACTION,
    reviews,
  };
};

const getUserReviewsAction = (reviews) => {
  return {
    type: GET_USER_REVIEWS_ACTION,
    reviews,
  };
};

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  let reviews = await csrfFetch(`/api/spots/${spotId}/reviews`);
  reviews = await reviews.json();
  // console.log("get spot reviews", reviews);
  dispatch(getSpotReviewsAction(reviews));
  return reviews;
};

export const thunkGetUserReviews = () => async (dispatch) => {
  let userReviews = await csrfFetch(`/api/reviews/current`);
  userReviews = await userReviews.json();

  console.log("thunk userReviews", userReviews.Reviews);
  dispatch(getUserReviewsAction(userReviews.Reviews));
  return userReviews;
};

//initialState = review = {spot, user}
const initialState = { spot: {}, user: {} };
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOT_REVIEWS_ACTION: {
      newState = { ...state };
      action.reviews.forEach(
        (review) => (newState.spot[review.id] = { ...review })
      );
      return newState;
    }
    case GET_USER_REVIEWS_ACTION: {
      newState = { ...state };
      // console.log("reducer user reviews", action.reviews);
      action.reviews.forEach((review) => (newState.user[review.id] = review));
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
