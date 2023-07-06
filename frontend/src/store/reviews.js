import { csrfFetch } from "./csrf";

// reviews/current GET
// reviews/${review.id}/images POST
// reviews/${review.id} DELETE
// review-images/{reviewImage.id} DELETE

const initialState = { spot: {}, user: {} };
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    default:
      return state;
  }
};

export default reviewsReducer;
