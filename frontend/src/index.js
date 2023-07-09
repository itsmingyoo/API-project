// frontend/src/index.js
import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider, Modal } from "./context/Modal";
import App from "./App";

import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import * as spotsActions from "./store/spots";
import * as reviewsActions from "./store/reviews";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.spotsActions = spotsActions;
  window.reviewsActions = reviewsActions;
}
// window.store.dispatch(window.spotsActions.thunkGetSpotId(1))
// window.store.dispatch(window.sessionActions.logout());
// window.store.dispatch(
//   window.sessionActions.signup({
//     username: "NewUser",
//     firstName: "New",
//     lastName: "User",
//     email: "new@user.io",
//     password: "password",
//   })
// );

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Modal />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
