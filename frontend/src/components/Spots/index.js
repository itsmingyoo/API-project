import React from "react";
import { NavLink } from "react-router-dom";
import SpotItem from "./SpotItem";
import "./spots.css";

function AllSpots({ spots }) {
  if (!spots.length > 0) return null;
  return (
    <div id="spots-container">
      {spots.map((spot) => (
        <div key={spot.id} id="spot-item-container">
          <NavLink
            to={`/spots/${spot.id}`}
            title={spot.name}
            id="spot-nav-link"
          >
            <SpotItem spot={spot} />
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default AllSpots;
