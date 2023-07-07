function SpotItem({ spot }) {
  return (
    <>
      <div id="spot-img">
        <img src={spot.previewImage} alt="previewImage" />
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
