import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetSpots } from "../../store/spots";
import SpotItem from "./SpotItem";

import "./spots.css";

function AllSpots() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetSpots());
  }, []);

  const allSpots = useSelector((state) => Object.values(state.spots));
  if (!allSpots.length > 0) return null;
  //   console.log("all spots array", allSpots);
  return (
    <div id="spots-container">
      {/* <h2>All Spots Test</h2> */}
      {allSpots.map((spot) => (
        <div key={spot.id}>
          <SpotItem spot={spot}>{spot.name}</SpotItem>
        </div>
      ))}
      {/* <RenderComponentsHere /> */}
    </div>
  );
}

export default AllSpots;
