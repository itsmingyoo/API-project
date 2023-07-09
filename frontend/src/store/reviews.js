import { csrfFetch } from "./csrf";

const GET_SPOT_REVIEWS_ACTION = "reviews/getSpotReviewsAction";
const GET_USER_REVIEWS_ACTION = "reviews/getUserReviewsAction";
const CREATE_REVIEW_ACTION = "reviews/createReviewAction";
const DELETE_REVIEW_ACTION = "reviews/deleteReviewAction";
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

const createReviewAction = (review) => {
  return {
    type: CREATE_REVIEW_ACTION,
    review,
  };
};

const deleteReviewAction = (reviewId) => {
  return {
    type: DELETE_REVIEW_ACTION,
    reviewId,
  };
};

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
  let reviews = await csrfFetch(`/api/spots/${spotId}/reviews`);
  reviews = await reviews.json();
  dispatch(getSpotReviewsAction(reviews));
  return reviews;
};

export const thunkGetUserReviews = () => async (dispatch) => {
  let userReviews = await csrfFetch(`/api/reviews/current`);
  userReviews = await userReviews.json();
  dispatch(getUserReviewsAction(userReviews.Reviews));
  return userReviews;
};

export const thunkCreateReview = (spotId, review) => async (dispatch) => {
  try {
    let newReview = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    });
    newReview = await newReview.json();
    dispatch(createReviewAction(newReview));
    dispatch(thunkGetSpotReviews(spotId));
    return newReview;
  } catch (e) {
    return await e.json();
  }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  let del = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  del = await del.json();
  dispatch(deleteReviewAction(reviewId));
  return del;
};

//initialState = review = {spot, user}
const initialState = { spot: {}, user: {} };
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOT_REVIEWS_ACTION: {
      newState = { ...state };
      newState.spot = {};
      action.reviews.forEach(
        (review) => (newState.spot[review.id] = { ...review })
      );
      return newState;
    }
    case GET_USER_REVIEWS_ACTION: {
      newState = { ...state };
      action.reviews.forEach((review) => (newState.user[review.id] = review));
      return newState;
    }
    case CREATE_REVIEW_ACTION: {
      newState = { ...state };
      newState.spot[action.review.id] = action.review;
      return newState;
    }
    case DELETE_REVIEW_ACTION: {
      newState = { ...state };
      delete newState.spot[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
