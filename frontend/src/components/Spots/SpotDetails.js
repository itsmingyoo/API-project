import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetReviews, thunkGetSpotId } from "../../store/spots";
import { LoremIpsum, loremIpsum } from "react-lorem-ipsum";

function SpotDetails() {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = parseInt(spotId);

  const spotReviewsArr = useSelector((state) => state.spots.Reviews);
  const spot = useSelector((state) => state.spots.spot);
  useEffect(() => {
    dispatch(thunkGetSpotId(spotId));
    dispatch(thunkGetReviews(spotId));
  }, [spotId, dispatch]);

  // console.log("this is spot", spot);
  if (!spotReviewsArr) return null;
  if (!spot) return null;
  console.log("reviews Arr", spotReviewsArr);

  const firstImage = [];
  const fourImages = [];
  if (spotReviewsArr.ReviewImages && spotReviewsArr.ReviewImages.length > 0) {
    firstImage.push(spotReviewsArr[0].ReviewImages[0]);
    for (let i = 1; i < 5; i++) {
      const image = spotReviewsArr[0].ReviewImages[i];
      if (image !== null || image !== undefined) {
        fourImages.push(image);
      }
    }
    // console.log("first image", firstImage);
    // console.log("four image", fourImages);
  }

  return (
    <div id="spot-details__container">
      <div id="spot-detail__name">{spot.name}</div>
      <div id="spot-details__location">
        <div>
          {spot.city}, {spot.state}, {spot.country}
        </div>
      </div>
      {/* images */}
      <div id="spot-details__images">
        <div id="review-image__left">
          <img src={firstImage.url} />
        </div>
        <div id="review-image__right">
          {fourImages.length > 0 &&
            fourImages.map((image) => (
              <div key={image.id} id={`review-image`}>
                <img
                  src={image.url}
                  className={`review-image__${image.id} review-image`}
                />
              </div>
            ))}
          {(!fourImages || fourImages.length === 0) && (
            <div>Images Coming Soon!</div>
          )}
        </div>
      </div>
      <div id="spot-details__container-description">
        <div id="spot-details__owner-description">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.firstName}
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
          <button id="spot-details__reserve-button">Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
