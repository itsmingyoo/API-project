import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkGetSpots } from "../../store/spots";
import SpotItem from "./SpotItem";

import "./spots.css";

function AllSpots({ spots }) {
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(thunkGetSpots());
  //   }, []);

  //   const allSpots = useSelector((state) => Object.values(state.spots));
  if (!spots.length > 0) return null;
  //   console.log("all spots array", spots);
  return (
    <div id="spots-container">
      {/* <h2>All Spots Test</h2> */}
      {spots.map((spot) => (
        <div key={spot.id} id="spot-item-container">
          <NavLink to={`/spots/${spot.id}`} title={spot.name}>
            <SpotItem spot={spot} />
          </NavLink>
        </div>
      ))}
      {/* <RenderComponentsHere /> */}
    </div>
  );
}

export default AllSpots;
