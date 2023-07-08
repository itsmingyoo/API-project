import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkCreateReview, thunkGetSpotReviews } from "../../store/reviews";
import { thunkGetSpotId } from "../../store/spots";

function CreateReviewModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);

  console.log(`YOU ARE WORKING WITH THIS ===`, spot);
  const onClick = (e) => {
    e.preventDefault();
    const data = {
      review,
      stars,
    };
    // console.log("this is data object to send and spot.id", spot.id, data);
    dispatch(thunkCreateReview(spot.id, data))
      .then(() => dispatch(thunkGetSpotId(spot.id)))
      .then(() => dispatch(thunkGetSpotReviews(spot.id))) // dispatch an action to force a re-render of the user's spots
      .then(closeModal);
    // console.log("dispatched create review");
  };
  let disabled = review.length < 10;
  return (
    <>
      <div>
        <div>How was your stay?</div>
        <input
          type="text"
          placeholder="Leave your review here.."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></input>
        <div>5 star elements : Stars</div>
        <button onClick={onClick} disabled={disabled}>
          Submit Your Review
        </button>
      </div>
    </>
  );
}

export default CreateReviewModal;
