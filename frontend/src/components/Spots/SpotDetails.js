import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function SpotDetails() {
  let { spotId } = useParams();
  spotId = parseInt(spotId);
  const spots = useSelector((state) => state.spots);
  const spot = spots[spotId];
  return (
    <>
      <h2>This is spot # {spot.id}</h2>
    </>
  );
}

export default SpotDetails;
