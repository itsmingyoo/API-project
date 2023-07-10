import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import {
  thunkDeleteUserSpot,
  thunkGetSpots,
  thunkGetUserSpots,
} from "../../store/spots";
import "./spots.css";

function DeleteModalButton({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const onClick = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteUserSpot(spot.id))
      .then(() => dispatch(thunkGetUserSpots())) // dispatch an action to force a re-render of the user's spots
      .then(() => dispatch(thunkGetSpots))
      .then(closeModal);
  };

  return (
    <>
      <div id="confirm-modal">
        <div id="confirm-delete">Confirm Delete</div>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div id="confirm-buttons__container">
          <button onClick={onClick} id="yes-button">
            Yes (Delete Spot)
          </button>
          <button onClick={closeModal} id="no-button">
            No (Keep Spot)
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteModalButton;
