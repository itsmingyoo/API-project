import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview, thunkGetSpotReviews } from "../../store/reviews";
import { thunkGetSpotId } from "../../store/spots";

function DeleteReviewModalButton({ spot, review }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const onClick = async (e) => {
    e.preventDefault();
    dispatch(thunkDeleteReview(review.id))
      .then(() => dispatch(thunkGetSpotId(spot.id)))
      .then(() => dispatch(thunkGetSpotReviews(spot.id)))
      .then(closeModal);
  };
  return (
    <>
      <div>
        <div>Confirm Delete</div>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button onClick={onClick}>Yes (Delete Spot)</button>
        <button onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </>
  );
}

export default DeleteReviewModalButton;
