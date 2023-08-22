import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { PiListDashesFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} id="pfp-button-icons">
        <PiListDashesFill className="dashes" />
        <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div id="profile-container">
            {/* <div>{user.username}</div> */}
            <div>Hello, {user.firstName}</div>
            <div>{user.email}</div>
            <div>
              <NavLink to="/spots/current" id="manage-spots">
                Manage Spots
              </NavLink>
            </div>
            <div>
              <NavLink to="/bookings">Trips</NavLink>
            </div>
            <div>
              <button onClick={logout}>
                <NavLink to="/">Log Out</NavLink>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div id="login-signup-modal">
              <OpenModalMenuItem itemText="Log In" onItemClick={closeMenu} modalComponent={<LoginFormModal />} />
            </div>
            <div id="login-signup-modal">
              <OpenModalMenuItem itemText="Sign Up" onItemClick={closeMenu} modalComponent={<SignupFormModal />} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
