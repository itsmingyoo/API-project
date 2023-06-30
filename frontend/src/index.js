// frontend/src/index.js
import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import configureStore from "./store";
// ... other imports
import { restoreCSRF, csrfFetch } from "./store/csrf";

import * as sessionActions from "./store/session";


const store = configureStore();

/**
 * To test if restoreCSRF works, copy paste this code into your Browser
 * window.csrfFetch('/api/test', {
    method: 'POST',
    body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
  }).then(res => res.json()).then(data => console.log(data));
 *Note: there is no need to specify headers bc the default header for "Content-Type" is set to "application/json" and the "XSRF-TOKEN" header are added by the custom csrfFetch
 */
if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
