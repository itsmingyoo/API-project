import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetReviews, thunkGetSpotId } from "../../store/spots";
// import "./spots.css";

function SpotDetails() {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = parseInt(spotId);

  const spotReviewsArr = useSelector((state) => state.spots.reviews);
  const spot = useSelector((state) => state.spots.spot);
  useEffect(() => {
    dispatch(thunkGetSpotId(spotId));
    dispatch(thunkGetReviews(spotId));
  }, [dispatch]);

  if (!spotReviewsArr) return null;
  if (!spot) return null;

  // normalizing reviews data
  const spotReviewsObj = {};
  spotReviewsArr.forEach((review) => (spotReviewsObj[review.id] = review));
  // console.log("CL spotReviewsObj", spotReviewsObj);
  // console.log("CL spotDetails", spot);
  const firstImage = spotReviewsObj[spotId].ReviewImages[0];
  const fourImages = [];

  for (let i = 1; i < spotReviewsObj[spotId].ReviewImages.length; i++) {
    const image = spotReviewsObj[spotId].ReviewImages[i];
    fourImages.push(image);
  }

  // for (let i = 0; i < spotReviewsObj[spotId].ReviewImages.length; i++) {
  //   if ((i = 0)) {
  //     firstImage.push(spotReviewsObj[spotId].ReviewImages[0]);
  //   }
  //   if (i + 1 === spotReviewsObj[spotId].ReviewImages.length) {
  //     break;
  //   } else {
  //     fourImages.push(spotReviewsObj[spotId].ReviewImages[i + 1]);
  //   }
  // }
  console.log("first image", firstImage);
  console.log("four image", fourImages);

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
            <div key={image.id} id={`review-image__${image.id}`}>
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
