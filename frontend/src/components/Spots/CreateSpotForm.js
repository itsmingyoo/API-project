import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./spots.css";

function CreateSpot() {
  const history = useHistory();
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => Object.values(state.spots.allSpots));
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
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
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

    // helper func for unique address
    const isValidAddress = (array, address) => {
      const res = array.filter((index) => {
        return index["address"] === address;
      });
      if (res.length > 0) return false;
      else if (res.length === 0) return true;
    };
    if (!isValidAddress(allSpots, address)) {
      errors["address"] = "Unique address is required";
    }

    if (state.length > 2 || state.length < 2) {
      errors["state"] = "State must be 2 characters";
    }

    if (description.length < 30 && description.length > 0) {
      errors["description"] = "Description must be at least 30 characters";
    }

    // helper function to check valid url
    let isURL = (url) => {
      if (url.endsWith(".jpeg")) return true;
      if (url.endsWith(".jpg")) return true;
      if (url.endsWith(".png")) return true;
      else return false;
    };
    if (previewImage.length > 0 && !isURL(previewImage)) {
      errors["previewImage"] = "Preview image is required";
    }
    if (imageOne.length > 0 && !isURL(imageOne)) {
      errors["imageOne"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (imageTwo.length > 0 && !isURL(imageTwo)) {
      errors["imageTwo"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (imageThree.length > 0 && !isURL(imageThree)) {
      errors["imageThree"] = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (imageFour.length > 0 && !isURL(imageFour)) {
      errors["imageFour"] = "Image URL must end in .png, .jpg, or .jpeg";
    }

    setValidationErrors(errors);
  }, [
    country,
    address,
    city,
    state,
    description,
    title,
    price,
    previewImage,
    allSpots,
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
  ]);

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
      imageOne,
      imageTwo,
      imageThree,
      imageFour,
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
        <label>
          Country{" "}
          {validationErrors.country && <span>{validationErrors.country}</span>}
        </label>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <label>
          Street Address{" "}
          {validationErrors.address && <span>{validationErrors.address}</span>}
        </label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <div id="form__city-state">
          <div className="form__city-state">
            <label>
              City{" "}
              {validationErrors.city && <span>{validationErrors.city}</span>}
            </label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form__city-state">
            <label>
              State{" "}
              {validationErrors.state && <span>{validationErrors.state}</span>}
            </label>
            <input
              type="text"
              name="state"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
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
          <input
            type="url"
            name="image-url"
            placeholder="Image URL"
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
          />
          <input
            type="url"
            name="image-url"
            placeholder="Image URL"
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
          />
          <input
            type="url"
            name="image-url"
            placeholder="Image URL"
            value={imageThree}
            onChange={(e) => setImageThree(e.target.value)}
          />
          <input
            type="url"
            name="image-url"
            placeholder="Image URL"
            value={imageFour}
            onChange={(e) => setImageFour(e.target.value)}
          />
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
