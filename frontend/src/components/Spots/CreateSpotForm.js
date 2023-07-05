import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./spots.css";

function CreateSpot() {
  // useSelector to grab user input info
  // useEffect -> dispatch -> thunk that grabs user info
  // onSubmit button - sends data to backend, preventDefault, history.push(redirect)
  // create form
  const history = useHistory();
  const dispatch = useDispatch();
  // set these in order top-down
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
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

  useEffect(() => {
    const errors = {};
    if (country.length < 0) errors["country"] = "Country is required";
    // useSelector to grab existing addresses in order to compare if they are unique in the system or not
    if (state.length > 2 || state.length < 2) {
      errors["state"] = "State must be 2 characters";
    }
    if (description.length < 30 && description.length > 0) {
      errors["description"] = "Description must be at least 30 characters";
    }
    if (previewImage.length > 0 && !previewImage.includes(".com")) {
      errors["previewImage"] = "Preview Image must be a valid URL";
    }
    setValidationErrors(errors);
  }, [country, address, city, state, description, title, price, previewImage]);

  const onSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    const formData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      title,
      price,
      previewImage,
    };
    dispatch(thunkCreateSpot(formData));
    console.log(formData);
    history.push("/"); //should redirect to the new spot with the spot details
  };

  // TODO for <hr> line, cant display in the form so workaround with border-top attribute
  return (
    <div>
      <hr></hr>
      <form id="form__main-container" onSubmit={onSubmit}>
        <h1>Create a new Spot</h1>
        <div>
          <h2>Where's your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <label>Country</label>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {validationErrors.country && <p>{validationErrors.country}</p>}
        <label>Street Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {validationErrors.address && <p>{validationErrors.address}</p>}
        <div id="form__city-state">
          <div className="form__city-state">
            <label>City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            {validationErrors.city && <p>{validationErrors.city}</p>}
          </div>
          <div className="form__city-state">
            <label>State</label>
            <input
              type="text"
              name="state"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            {validationErrors.state && <p>{validationErrors.state}</p>}
          </div>
        </div>
        <div id="form__lat-lng">
          <div className="form__lat-lng">
            <label>Latitude</label>
            <input
              type="text"
              name="lat"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div className="form__lat-lng">
            <label>Longitude</label>
            <input
              type="text"
              name="lng"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {validationErrors.description && (
              <p>{validationErrors.description}</p>
            )}
          </div>
        </div>
        <hr></hr>
        <div id="form__place-title">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            name="title"
            placeholder="Name of your spot"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {validationErrors.title && <p>{validationErrors.title}</p>}
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
              type="number"
              name="price"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {validationErrors.price && <p>{validationErrors.price}</p>}
          </div>
        </div>
        <div id="form__place-photos">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one </p>
          <input
            type="url"
            name="preview-link"
            placeholder="Preview Image Url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
          {validationErrors.previewImage && (
            <p>{validationErrors.previewImage}</p>
          )}
          <input type="url" name="image-url" placeholder="Image URL" />
          <input type="url" name="image-url" placeholder="Image URL" />
          <input type="url" name="image-url" placeholder="Image URL" />
          <input type="url" name="image-url" placeholder="Image URL" />
        </div>
        <button
          id="create-spot-button"
          disabled={Object.keys(validationErrors).length > 0}
        >
          Create Spot
        </button>
      </form>
    </div>
  );
}

export default CreateSpot;
