import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function SpotDetails() {
  let { spotId } = useParams();
  //   console.log("current spotId", spotId);
  spotId = parseInt(spotId);
  //   console.log("params spotId: ", spotId);
  //   const spotsNormalized = {};
  //   spots.forEach((spot) => (spotsNormalized.spot = spot));
  //   console.log("spots ===> ", spotsNormalized);
  const spots = useSelector((state) => state.spots);
  //   console.log("this is spots useselector", spots);
  const spot = spots[spotId];
  console.log("spot", spot);
  return <h2>This is spot # {spot.id}</h2>;
}

export default SpotDetails;
