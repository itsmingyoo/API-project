import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./form.css";

function CreateSpot() {
  const history = useHistory();
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => Object.values(state.spots.allSpots));
  // set these in order top-down
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(5);
  const [lng, setLng] = useState(5);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
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
      errors["address"] = "Address must be unique";
    }

    if (state !== "" && state.length !== 2) {
      errors["state"] = "State must be 2 capital letters";
    }

    if (description.length < 30 && description.length > 0) {
      errors["description"] = "Description must be at least 30 characters";
    }

    if (price.length > 9) {
      errors["price"] = "Price is not reasonable or too large";
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
    name,
    price,
    previewImage,
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
  ]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const spotImages = [];
    if (imageOne && imageOne !== "") spotImages.push(imageOne);
    if (imageTwo && imageTwo !== "") spotImages.push(imageTwo);
    if (imageThree && imageThree !== "") spotImages.push(imageThree);
    if (imageFour && imageFour !== "") spotImages.push(imageFour);

    const formData = {
      country,
      address,
      city,
      state,
      lat: 31,
      lng: 31,
      description,
      name,
      price: Number(price),
    };
    const dispatchErrors = {};
    if (previewImage === "")
      dispatchErrors["previewImage"] = "Preview image is required";
    if (description === "" || description.length < 30)
      dispatchErrors["description"] =
        "Description must be at least 30 characters";

    const res = await dispatch(
      thunkCreateSpot(formData, previewImage, spotImages)
    );

    if (address === "") dispatchErrors["address"] = res.errors.address;
    if (city === "") dispatchErrors["city"] = res.errors.city;
    if (state === "") dispatchErrors["state"] = res.errors.state;
    if (country === "") dispatchErrors["country"] = res.errors.country;
    if (name === "") dispatchErrors["name"] = res.errors.name;
    if (price === "") dispatchErrors["price"] = res.errors.price;
    setValidationErrors(dispatchErrors);
    // console.log("in the submit, res", res);
    // console.log("inside onSubmit", res, dispatchErrors, !validationErrors);

    if (Object.values(validationErrors).length === 0 && res.id) {
      history.push(`/spots/${res.id}`);
    }
  };

  // TODO for <hr> line, cant display in the form so workaround with border-top attribute
  return (
    <div>
      <div id="form-container">
        {/* <hr></hr> */}
        <form id="form__main-container" onSubmit={onSubmit}>
          <h1>Create a new Spot</h1>
          <div id="form__text">
            <h2>Where's your place located?</h2>
            <span>
              Guests will only get your exact address once they booked a
              reservation.
            </span>
          </div>
          <label id="label-and-errors">
            Country{" "}
            {validationErrors.country && (
              <span className="errors">{validationErrors.country}</span>
            )}
          </label>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label>
            Street Address{" "}
            {validationErrors.address && (
              <span className="errors">{validationErrors.address}</span>
            )}
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div id="form__city-state">
            <div className="form__city-state">
              <label>
                City{" "}
                {validationErrors.city && (
                  <span className="errors">{validationErrors.city}</span>
                )}
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div id="comma">,</div>

            <div className="form__city-state">
              <label>
                State{" "}
                {validationErrors.state && (
                  <span className="errors">{validationErrors.state}</span>
                )}
              </label>
              <input
                id="form__state-input"
                type="text"
                name="state"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>
          {/* <div id="form__lat-lng">
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
        </div> */}
          <div id="form__place-description">
            <h2>Describe your place to guests</h2>
            <p>
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <div>
              <textarea
                id="form__owner-description"
                name="description"
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {validationErrors.description && (
                <p className="errors">{validationErrors.description}</p>
              )}
            </div>
          </div>
          <div id="form__place-title">
            <h2>Create a title for your spot</h2>
            <p>
              Catch guests' attention with a spot title that highlights what
              makes your place special.
            </p>
            <input
              type="text"
              name="name"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <p className="errors">{validationErrors.name}</p>
            )}
          </div>
          <div id="form__place-price">
            <h2>Set a base price for your spot</h2>
            <p>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <div id="form__price">
              $
              <input
                id="form__price-input"
                type="number"
                name="price"
                placeholder="Price per night (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {validationErrors.price && (
                <p className="errors">{validationErrors.price}</p>
              )}
            </div>
          </div>
          <div id="form__place-photos">
            <h2>Liven up your spot with photos</h2>
            <span>Submit at least a preview image </span>
            <input
              type="url"
              name="preview-link"
              placeholder="Preview Image Url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
            {validationErrors.previewImage && (
              <p className="errors">{validationErrors.previewImage}</p>
            )}
            <input
              type="url"
              name="image-url"
              placeholder="Image URL"
              value={imageOne}
              onChange={(e) => setImageOne(e.target.value)}
            />
            {validationErrors.imageOne && (
              <p className="errors">{validationErrors.imageOne}</p>
            )}
            <input
              type="url"
              name="image-url"
              placeholder="Image URL"
              value={imageTwo}
              onChange={(e) => setImageTwo(e.target.value)}
            />
            {validationErrors.imageTwo && (
              <p className="errors">{validationErrors.imageTwo}</p>
            )}
            <input
              type="url"
              name="image-url"
              placeholder="Image URL"
              value={imageThree}
              onChange={(e) => setImageThree(e.target.value)}
            />
            {validationErrors.imageThree && (
              <p className="errors">{validationErrors.imageThree}</p>
            )}
            <input
              type="url"
              name="image-url"
              placeholder="Image URL"
              value={imageFour}
              onChange={(e) => setImageFour(e.target.value)}
            />
            {validationErrors.imageFour && (
              <p className="errors">{validationErrors.imageFour}</p>
            )}
          </div>
          <button id="create-spot-button">Create Spot</button>
        </form>
      </div>
    </div>
  );
}

export default CreateSpot;
