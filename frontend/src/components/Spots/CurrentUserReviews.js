import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserReviews } from "../../store/spots";

function CurrentUserReviews() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const userReview = useSelector((state) => state.user);
  console.log("sessionUser", sessionUser);
  console.log("userReview", userReview);

  useEffect(() => {
    dispatch(thunkGetUserReviews());
  }, [dispatch]);
  return <h2>hello</h2>;
}

export default CurrentUserReviews;
