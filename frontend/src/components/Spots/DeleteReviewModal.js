import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteReview, thunkGetSpotReviews } from "../../store/reviews";
import { thunkGetSpotId } from "../../store/spots";
import "./spots.css";

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
      <div id="confirm-modal">
        <div id="confirm-delete">Confirm Delete</div>
        <p>Are you sure you want to remove this review from the listings?</p>
        <div id="confirm-buttons__container">
          <button onClick={onClick} id="yes-button">
            Yes (Delete Review)
          </button>
          <button onClick={closeModal} id="no-button">
            No (Keep Review)
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteReviewModalButton;
