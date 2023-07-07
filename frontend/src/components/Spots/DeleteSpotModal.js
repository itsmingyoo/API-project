import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import {
  thunkDeleteUserSpot,
  thunkGetSpotId,
  thunkGetUserSpots,
} from "../../store/spots";

function DeleteModalButton({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // console.log("this is spot", spot.id);
  const onClick = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteUserSpot(spot.id))
      .then(() => dispatch(thunkGetUserSpots())) // dispatch an action to force a re-render of the user's spots
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

export default DeleteModalButton;
