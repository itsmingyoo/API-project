import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function SpotDetails() {
  let { spotId } = useParams();
  spotId = parseInt(spotId);
  const spots = useSelector((state) => state.spots);
  const spot = spots[spotId];
  if (!spot) return null;
  console.log("spotdetails", spot);
  return (
    <div id="spot-details__container">
      <h2>This is test spot # {spot.id}</h2>
      <div>{spot.name}</div>
      <div id="spot-details__location">
        <div>
          {spot.city}, {spot.state}, {spot.country}
        </div>
      </div>
      <div id="spot-details__images"></div>
    </div>
  );
}

export default SpotDetails;
