import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import { thunkGetSpots } from "./store/spots";
import Navigation from "./components/Navigation";
import AllSpots from "./components/Spots";
import SpotDetails from "./components/Spots/SpotDetails";
import CreateSpot from "./components/Spots/CreateSpotForm";
import CurrentUserSpots from "./components/Spots/CurrentUserSpots";
import UpdateSpot from "./components/Spots/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(thunkGetSpots());
  }, [dispatch]);
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots spots={spots} />
          </Route>
          <Route exact path="/spots">
            <CreateSpot spots={spots} />
          </Route>
          <Route exact path="/spots/current">
            <CurrentUserSpots spots={spots} />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotDetails spots={spots} />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <UpdateSpot spots={spots} />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
