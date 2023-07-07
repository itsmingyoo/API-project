import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetSpotId } from "../../store/spots";
import { LoremIpsum } from "react-lorem-ipsum";
import SpotReviews from "./SpotReviews";

function SpotDetails() {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = parseInt(spotId);

  //spotReviewsArr is an array of obj: ReviewImages: [], User: {}, etc
  // const spotReviewsArr = useSelector((state) => state.spots.Reviews);
  const spot = useSelector((state) => state.spots.singleSpot);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetSpotId(spotId));
    // dispatch(thunkGetReviews(spotId));
  }, [spotId, dispatch]);

  // console.log("this is spot", spot);
  if (!spot || spot.id !== spotId) return null;
  // console.log("reviews Arr", spotReviewsArr, spotReviewsArr.length);

  // object: fit-cover css???
  const firstImage = spot ? spot?.SpotImages?.[0]?.url : [];
  const fourImages = []; // array of obj, must key into url kvp

  if (spot.SpotImages.length > 1) {
    for (let i = 1; i < 5; i++) {
      const image = spot.SpotImages[i];
      if (image !== null || image !== undefined) {
        fourImages.push(image);
      }
    }
  }
  // console.log("first image", firstImage);
  // console.log("four image", fourImages);

  return (
    <div id="spot-details__container">
      <h2 id="spot-detail__name">{spot.name}</h2>
      <div id="spot-details__location">
        <div>
          <h4>
            {spot.city}, {spot.state}, {spot.country}
          </h4>
        </div>
      </div>

      {/* images component */}
      <div id="spot-details__container-images">
        <div id="spot-image__left">
          {firstImage ? (
            <img src={firstImage} alt="spot-details__preview" />
          ) : (
            <div className="spot-details__coming-soon-main">
              Image Coming Soon!
            </div>
          )}
        </div>
        <div id="spot-image__right">
          {fourImages.length > 0 &&
            fourImages.map((image) => (
              <div key={image.id} id={`spot-image`}>
                {/* {console.log("inside map", image)} */}
                <img
                  src={image.url}
                  className={`spot-image__${image.id} spot-image`}
                  alt={`spot-image__${image.id}`}
                />
              </div>
            ))}
          {(!fourImages || fourImages.length === 0) && (
            <>
              <div className="spot-details__coming-soon">
                Image Coming Soon!
              </div>
              <div className="spot-details__coming-soon">
                Image Coming Soon!
              </div>
              <div className="spot-details__coming-soon">
                Image Coming Soon!
              </div>
              <div className="spot-details__coming-soon">
                Image Coming Soon!
              </div>
            </>
          )}
        </div>
      </div>
      {/* description component */}
      <div id="spot-details__container-description">
        <div id="spot-details__owner-description">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <div id="spot-details__spot-description">
            <div className="spot-details__text">
              <LoremIpsum />
            </div>
            <div className="spot-details__text">
              <LoremIpsum />
            </div>
          </div>
        </div>
        <div id="spot-details__container-reservation">
          <div id="spot-detail__price-rating">
            <div>
              <span>${spot.price}</span>
            </div>
            <div>
              <span className="spot-detail__avgRating">
                ★{spot.avgRating} ·
              </span>
              <span>{spot.numReviews} review(s)</span>
            </div>
          </div>
          <button
            id="spot-details__reserve-button"
            onClick={() => alert("Feature Coming Soon...")}
          >
            Reserve
          </button>
        </div>
      </div>

      <hr></hr>

      {/* reviews component */}
      <div id="spot-details__container-reviews">
        {/* Star rating && # of Reviews */}
        <div>
          <span className="spot-detail__avgRating">★{spot.avgRating} ·</span>
          <span>{spot.numReviews} review(s)</span>
          {sessionUser && (
            <button id="spot-detail__create-review">Post Your Review</button>
          )}
        </div>

        <SpotReviews spot={spot} />
      </div>
    </div>
  );
}

export default SpotDetails;
