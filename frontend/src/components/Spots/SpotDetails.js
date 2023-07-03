import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetReviews, thunkGetSpotId } from "../../store/spots";
// import "./spots.css";

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

  // console.log("reviews obj", spotReviewsArr);
  // console.log("this is spot", spot);
  if (!spotReviewsArr) return null;
  if (!spot) return null;
  const firstImage = spotReviewsArr[0].ReviewImages[0];
  const fourImages = [];

  for (let i = 1; i < 5; i++) {
    const image = spotReviewsArr[0].ReviewImages[i];
    fourImages.push(image);
  }
  // console.log("first image", firstImage);
  // console.log("four image", fourImages);

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
          {fourImages.map((image) => (
            <div key={image.id} id={`review-image`}>
              <img
                src={image.url}
                className={`review-image__${image.id} review-image`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
