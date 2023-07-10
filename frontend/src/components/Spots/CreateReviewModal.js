import React, { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkCreateReview, thunkGetSpotReviews } from "../../store/reviews";
import { thunkGetSpotId } from "../../store/spots";
import StarRatingInput from "./StarRatingInput";
import "./reviews.css";

function CreateReviewModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const errors = {};
    if (review.length > 0 && review.length < 10)
      errors["review"] = "Review must be at least 10 characters";
    // if (!stars) errors["stars"] = "Please choose a star rating";
    setValidationErrors(errors);
  }, [review, stars, dispatch]);

  // console.log(`YOU ARE WORKING WITH THIS ===`, spot);
  const onClick = (e) => {
    e.preventDefault();
    const data = {
      review,
      stars: Number(stars),
    };
    // console.log("this is data object to send and spot.id", spot.id, data);
    dispatch(thunkCreateReview(spot.id, data))
      .then(() => dispatch(thunkGetSpotId(spot.id)))
      .then(() => dispatch(thunkGetSpotReviews(spot.id))) // dispatch an action to force a re-render of the user's spots
      .then(closeModal);
    // console.log("dispatched create review");
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  };
  // console.log("this is stars", stars);

  let disabled = review.length < 10 || !stars;
  return (
    <>
      <div id="review-form__main">
        <div>How was your stay?</div>
        {validationErrors.review && (
          <div className="errors">{validationErrors.review}</div>
        )}
        {validationErrors.stars && (
          <div className="errors">{validationErrors.stars}</div>
        )}

        <input
          type="text"
          placeholder="Leave your review here.."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></input>

        <div>
          <StarRatingInput
            disabled={false}
            onChange={onChange}
            stars={stars}
            spot={spot}
          />
        </div>

        <button onClick={onClick} disabled={disabled}>
          Submit Your Review
        </button>
      </div>
    </>
  );
}

export default CreateReviewModal;
