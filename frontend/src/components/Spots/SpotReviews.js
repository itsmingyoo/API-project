import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetSpotReviews } from "../../store/reviews";

function SpotReviews({ spot }) {
  const dispatch = useDispatch();
  const spotReviewsArr = useSelector((state) =>
    Object.values(state.reviews.spot)
  );
  const sessionUser = useSelector((state) => state.session.user);

  // console.log("spot.id", spot.id);
  // console.log("spotReviewsArr", spotReviewsArr);
  // console.log("spot", spot);

  useEffect(() => {
    dispatch(thunkGetSpotReviews(spot.id));
  }, [dispatch]);

  if (!spotReviewsArr) return null;

  // boolean values to hide/show post a review button
  // owner of spot => hide post a review button
  const isOwner = sessionUser?.id === spot.ownerId ? true : false;
  const userHasReview =
    spotReviewsArr.filter((spotReview) => spotReview.userId === sessionUser?.id)
      .length > 0
      ? true
      : false;
  const spotHasReviews = spotReviewsArr.length > 0 ? true : false;
  console.log("isOwner", isOwner);
  console.log("userHasReview", userHasReview);
  console.log("spotHasReviews", spotHasReviews);

  // not owner of spot && no review matching user => show post a review button

  return (
    <>
      <div id="spot-details__container-reviews">
        {/* Star rating && # of Reviews */}
        <div>
          {
            //logged in && not owner && no reviews
            !spotHasReviews && !isOwner && sessionUser ? (
              <>
                <span>Star NEW</span>
                <button>Post Your Review</button>
                <div>Be the first to post a review!</div>
              </>
            ) : // logged in && not owner && hasreview
            userHasReview && !isOwner && sessionUser ? (
              <>
                <span className="spot-detail__avgRating">
                  ★{spot.avgRating} ·
                </span>
                <span>{spot.numReviews} reviews</span>
              </>
            ) : // logged in && not owner && multiple has reviews
            spotReviewsArr.length > 1 && !isOwner && sessionUser ? (
              <>
                <span className="spot-detail__avgRating">
                  ★{spot.avgRating} ·
                </span>
                <span>{spot.numReviews} reviews</span>
                <button>Post Your Review</button>
              </>
            ) : // not logged in && 1 review
            spotReviewsArr.length === 1 && !isOwner && !sessionUser ? (
              <>
                <span className="spot-detail__avgRating">
                  ★{spot.avgRating} ·
                </span>
                <span>{spot.numReviews} review</span>
              </>
            ) : // not logged in && no reviews
            spotReviewsArr.length === 0 && !isOwner && !sessionUser ? (
              <span>Star NEW</span>
            ) : (
              <>
                <span className="spot-detail__avgRating">
                  ★{spot.avgRating} ·
                </span>
                <span>{spot.numReviews} reviews</span>
              </>
            )
          }
        </div>
        <div id="spot-details__user-review">
          {spotReviewsArr.length > 0 &&
            spotReviewsArr.map((review) => {
              const reviewDate = review["createdAt"].split("-");
              // console.log("in map for reviewDate", reviewDate);
              const monthNames = {
                "01": "January",
                "02": "February",
                "03": "March",
                "04": "April",
                "05": "May",
                "06": "June",
                "07": "July",
                "08": "August",
                "09": "September",
                10: "October",
                11: "November",
                12: "December",
              };
              const reviewYear = reviewDate[0];
              const reviewMonth = reviewDate[1];
              const reviewMonthName = monthNames[reviewMonth];
              return (
                <div key={review.User.id} id="user-review__container">
                  <div id="user-review__first-name">
                    {review["User"]["firstName"]}
                  </div>
                  <div>
                    {reviewMonthName} {reviewYear}
                  </div>
                  <div>{review["review"]}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default SpotReviews;
