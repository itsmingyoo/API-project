import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { thunkCreateReview, thunkGetSpotReviews } from "../../store/reviews";
import { thunkGetSpotId } from "../../store/spots";
import StarRatingInput from "./StarRatingInput";

function CreateReviewModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");

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
        <StarRatingInput
          disabled={false}
          onChange={onChange}
          stars={stars}
          spot={spot}
        />
        <button onClick={onClick} disabled={disabled}>
          Submit Your Review
        </button>
      </div>
    </>
  );
}

export default CreateReviewModal;
