import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUserSpots } from "../../store/spots";

function CurrentUserSpots() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const userSpots = useSelector((state) => state.spots.ownerSpots);
  // console.log("this is userSpots in component", userSpots);

  useEffect(() => {
    dispatch(thunkGetUserSpots(sessionUser.id));
  }, [dispatch]);

  if (!sessionUser || !userSpots) return null;
  return (
    <>
      <div id="manage-spots__header">
        <h2>Manage Your Spots</h2>
        <button>Create a New Spot</button>
      </div>

      <div id="manage-spots__main">
        {sessionUser && userSpots ? (
          userSpots.map((spot) => (
            <div key={spot.id} id="user-spot__content">
              <div id={`user-spot__${spot.id} user-spot__image`}>
                <img src={spot.previewImage} alt="preview" />
              </div>
              <div id="user-spot__location-rating">
                <div id="user-spot__location">
                  <span>{spot.city}, </span>
                  <span>{spot.state}</span>
                </div>
                <div id="user-spot__rating">Star {spot.avgRating}</div>
              </div>
              <div id="user-spot__price">${spot.price} night</div>
              <div id="user-spot__update-delete">
                <button>Update</button>
                <button>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>It's time for you to create a spot to fill out this page!</p>
        )}
      </div>
    </>
  );
}

export default CurrentUserSpots;
