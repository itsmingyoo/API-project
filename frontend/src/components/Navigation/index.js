// frontend/src/components/Navigation/index.js
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div id="header-container">
      <div id="header-content">
        <div>
          <NavLink exact to="/" id="header-content__home">
            <h2>AirBlobandBlob Logo</h2>
          </NavLink>
        </div>
        {isLoaded && (
          <div id="header-content__buttons">
            {sessionUser && (
              <NavLink to="/spots">
                <button id="header-content__create-spot">
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
