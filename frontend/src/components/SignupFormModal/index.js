import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const disabled =
    email === "" ||
    username === "" ||
    username.length < 4 ||
    firstName === "" ||
    lastName === "" ||
    password === "" ||
    password.length < 6 ||
    confirmPassword === "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div id="signup-form__container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} id="signup-form__content">
        <div>
          <input
            type="text"
            value={email}
            placeholder="Email"
            className="input-size"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errors.email && <span className="errors">{errors.email}</span>}
        <div>
          <input
            type="text"
            value={username}
            placeholder="Username"
            className="input-size"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {errors.username && <span className="errors">{errors.username}</span>}
        <div>
          <input
            type="text"
            value={firstName}
            placeholder="First Name"
            className="input-size"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        {errors.firstName && <span className="errors">{errors.firstName}</span>}
        <div>
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            className="input-size"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        {errors.lastName && <span className="errors">{errors.lastName}</span>}
        <div>
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="input-size"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.password && <span className="errors">{errors.password}</span>}
        <div>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            className="input-size"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errors.confirmPassword && (
          <span className="errors">{errors.confirmPassword}</span>
        )}
        <button
          type="submit"
          disabled={disabled}
          id={disabled ? "disabled" : ""}
          className="button signup-form__button"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
