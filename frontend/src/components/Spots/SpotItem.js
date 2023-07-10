function SpotItem({ spot }) {
  if (!spot.previewImage) return null;
  return (
    <>
      <div id="spot-img">
        <img src={spot?.previewImage} alt="previewImage" />
      </div>
      <div id="spot__item-info">
        <div className="big-bold">
          {spot.city}, {spot.state}
        </div>
        {spot.avgRating ? (
          <div className="big-bold">★ {spot.avgRating.toFixed(1)}</div>
        ) : (
          <div className="big-bold">★ New</div>
        )}
      </div>
      <div id="spot__item-price-night">
        <span id="spot__item-price" className="big-bold">
          ${`${spot.price.toFixed(2)}  `}
          &nbsp;
        </span>
        <label>night</label>
      </div>
    </>
  );
}

export default SpotItem;
