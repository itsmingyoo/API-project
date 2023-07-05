import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./spots.css";

function CreateSpot(formData) {
  // useSelector to grab user input info
  // useEffect -> dispatch -> thunk that grabs user info
  // onSubmit button - sends data to backend, preventDefault, history.push(redirect)
  // create form
  const history = useHistory();
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(thunkCreateSpot(formData));
  //   }, [dispatch]);

  //   useEffect(() => {
  //     let myInterval = setInterval(() => {
  //       console.log(`UseEffect3 with interval number ${count} is running`);
  //     }, 1000);
  //     return () => {
  //       console.log(
  //         `UseEffect3 cleanup ran.\nsetInterval number ${count} is being cleared out`
  //       );
  //       clearInterval(myInterval);
  //     };
  //   }, [count]);

  const onSubmit = (e) => {
    e.preventDefault();
    // setHasSubmitted(true)
    dispatch(thunkCreateSpot(formData));
    console.log("formData");
    history.push("/"); //should redirect to the new spot with the spot details
  };

  // TODO for <hr> line, cant display in the form so workaround with border-top attribute
  return (
    <div>
      <hr></hr>
      <form id="form__main-container">
        <h1>Create a new Spot</h1>
        <div>
          <h2>Where's your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <label>Country</label>
        <input type="text" name="country" placeholder="Country" />
        <label>Street Address</label>
        <input type="text" name="address" placeholder="Address" />
        <div id="form__city-state">
          <div className="form__city-state">
            <label>City</label>
            <input type="text" name="city" placeholder="City" />
          </div>
          <div className="form__city-state">
            <label>State</label>
            <input type="text" name="state" placeholder="STATE" />
          </div>
        </div>
        <div id="form__lat-lng">
          <div className="form__lat-lng">
            <label>Latitude</label>
            <input type="text" name="lat" placeholder="Latitude" />
          </div>
          <div className="form__lat-lng">
            <label>Longitude</label>
            <input type="text" name="lng" placeholder="Longitude" />
          </div>
        </div>
        <hr></hr>
        <div id="form__place-description">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <div>
            <input
              id="form__owner-description"
              type="text"
              name="description"
              placeholder="Please write at least 30 characters"
            />
          </div>
        </div>
        <hr></hr>
        <div id="form__place-title">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input type="text" name="title" placeholder="Name of your spot" />
        </div>
        <div id="form__place-price">
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div id="form__price">
            $
            <input
              type="text"
              name="price"
              placeholder="Price per night (USD)"
            />
          </div>
        </div>
        <div id="form__place-photos">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one </p>
          <input
            type="text"
            name="preview-link"
            placeholder="Preview Image Url"
          />
          <input type="text" name="image-url" placeholder="Image URL" />
          <input type="text" name="image-url" placeholder="Image URL" />
          <input type="text" name="image-url" placeholder="Image URL" />
          <input type="text" name="image-url" placeholder="Image URL" />
        </div>
        <button id="create-spot-button">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;
