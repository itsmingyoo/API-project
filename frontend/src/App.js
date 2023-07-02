import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots";
import { Route } from "react-router-dom";
import { thunkGetSpots } from "./store/spots";
import SpotDetails from "./components/Spots/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(thunkGetSpots());
  }, [dispatch]);
  const spots = useSelector((state) => Object.values(state.spots));
  // console.log("all spots from app.js", allSpots);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/">
          <AllSpots spots={spots} />
        </Route>
        <Route path="/spots/:spotId">
          <SpotDetails spots={spots} />
        </Route>
      </Switch>
    </>
  );
}

export default App;
