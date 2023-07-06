import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserSpots } from "../../store/spots";

function CurrentUserSpots() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  console.log("sessionUser", sessionUser);

  // const userReview = useSelector((state) => state.user);
  // console.log("userReview", userReview);

  useEffect(() => {
    dispatch(thunkGetUserSpots(sessionUser.id));
  }, [dispatch]);

  if (!sessionUser) return null;
  return <h2>hello</h2>;
}

export default CurrentUserSpots;
