import { useState, useEffect } from "react";
const useMapZoomAndBounds = (map: any) => {
  const [zoom, setZoom] = useState(map ? map.getZoom() : null);
  const [bounds, setBounds] = useState(map ? map.getBounds() : null);

  useEffect(() => {
    if (!map) return;

    const handleZoomChange = () => {
      setZoom(map.getZoom());
    };

    const handleBoundsChange = () => {
      setBounds(map.getBounds());
    };

    const zoomListener = map.addListener("zoom_changed", handleZoomChange);
    const boundsListener = map.addListener(
      "bounds_changed",
      handleBoundsChange
    );

    return () => {
      zoomListener.remove();
      boundsListener.remove();
    };
  }, [map]);

  return { zoom, bounds };
};

export default useMapZoomAndBounds;
