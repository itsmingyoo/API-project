function SpotItem({ spot }) {
  // console.log("this is the spot", spot);
  //   console.log("this is the previewImage", spot.previewImage);
  return (
    <>
      {/* HEY REMEMBER TO REPLACE THIS IMAGE KEY */}
      {/* <img
          src="https://cdn.vox-cdn.com/thumbor/lFQ3pGOjzP1XQ5puQms14ad7Wv8=/0x0:1400x788/920x613/filters:focal(588x282:812x506):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/70412073/0377c76083423a1414e4001161e0cdffb0b36e1f_760x400.0.png"
          alt="spot-img"
        /> */}
      <div id="spot-img">
        <img src={spot.previewImage} alt="previewImage" />
      </div>
      <div id="spot__item-info">
        <div>
          {spot.city}, {spot.state}
        </div>
        <div>{spot.avgRating} Test Rating</div>
      </div>
      <div id="spot__item-price">${spot.price}</div>
    </>
  );
}

export default SpotItem;
