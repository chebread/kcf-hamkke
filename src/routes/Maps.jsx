import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { forwardRef } from 'react';

const Maps = forwardRef(({ children, onClick, onLoad }, ref) => {
  const MAPBOX_API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;
  const initView = {
    longitude: 126.97674,
    latitude: 37.575937,
    zoom: 5,
  };
  console.log(MAPBOX_API_KEY);
  return (
    <Map
      ref={ref}
      onLoad={onLoad}
      onClick={onClick}
      mapboxAccessToken={MAPBOX_API_KEY}
      initialViewState={initView}
      mapStyle="mapbox://styles/..."
    >
      {children}
    </Map>
  );
});

export default Maps;
