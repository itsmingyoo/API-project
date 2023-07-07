import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { thunkGetSpotReviews } from "../../store/spots";
import { thunkGetSpotReviews } from "../../store/reviews";

function SpotReviews({ spot }) {
  const dispatch = useDispatch();
  const spotReviewsArr = useSelector((state) =>
    Object.values(state.reviews.spot)
  );
  const sessionUser = useSelector((state) => state.session.user);

  console.log("spot.id", spot.id);
  console.log("spotReviewsArr", spotReviewsArr);

  useEffect(() => {
    dispatch(thunkGetSpotReviews(spot.id));
  }, [dispatch]);

  if (!spotReviewsArr) return null;

  return (
    <>
      <div id="spot-details__container-reviews">
        {/* Star rating && # of Reviews */}
        <div>
          <span className="spot-detail__avgRating">★{spot.avgRating} ·</span>
          <span>{spot.numReviews} review(s)</span>
          {sessionUser && (
            <button id="spot-detail__create-review">Post Your Review</button>
          )}
        </div>
        <div id="spot-details__user-review">
          {/* Reviews - First name, Date, Review - 'POST REVIEW' button hidden for users not logged in */}
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
