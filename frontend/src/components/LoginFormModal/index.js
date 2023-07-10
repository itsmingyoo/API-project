// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const disabled = credential.length < 4 || password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const demo = () => {
    setErrors({});
    return dispatch(
      sessionActions.login({ credential: "FakeUser1", password: "password2" })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div id="login-form__container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} id="login-form__form">
        <div>
          <label id="login__user-password">
            <div>Username or Email</div>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label id="login__user-password">
            <div>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && <p>{errors.credential}</p>}
        </div>

        <div id="login-form__button-container">
          <button
            type="submit"
            id={disabled ? "disabled-button" : ""}
            className="login-form__button"
            disabled={disabled}
          >
            Log In
          </button>
          <p id="login__demo-user" onClick={demo}>
            Demo User
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
