// frontend/src/components/Navigation/index.js
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { thunkGetSpots } from "../../store/spots";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(thunkGetSpots());
  };
  return (
    <div id="header-container">
      <div id="header-content">
        <div>
          <i className="fa-light fa-tent">ICON HERE</i>
          <NavLink exact to="/" id="header-content__home">
            <div id="header-logo">AirBlob&Blob</div>
          </NavLink>
        </div>

        {isLoaded && (
          <div id="header-content__buttons">
            {sessionUser && (
              <NavLink to="/spots" onClick={onClick}>
                <button id="header-content__create-spot" onClick={onClick}>
                  Create a New Spot
                </button>
              </NavLink>
            )}
            <div>
              <ProfileButton user={sessionUser} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
