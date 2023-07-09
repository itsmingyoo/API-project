function SpotItem({ spot }) {
  if (!spot.previewImage) return null;
  return (
    <>
      <div id="spot-img">
        {console.log(
          "this is spot.previewImage in spotitem",
          spot.previewImage,
          spot
        )}
        <img src={spot?.previewImage} alt="previewImage" />
      </div>
      <div id="spot__item-info">
        <div>
          {spot.city}, {spot.state}
        </div>
        {spot.avgRating ? <div>★ {spot.avgRating}</div> : <div>★ New</div>}
      </div>
      <div id="spot__item-price">${spot.price}</div>
    </>
  );
}

export default SpotItem;
