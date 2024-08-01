import type { Marker } from "@googlemaps/markerclusterer";
import React, { useEffect, useRef, useState } from "react";
import { AdvancedMarker, useMap, Pin } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import useMapZoomAndBounds from "../hooks";

interface Poi {
  name: string;
  location: google.maps.LatLngLiteral | google.maps.LatLng | null | undefined;
  key: string;
}

const PoiMarkers = (props: {
  pois: Poi[];
  onDeleteLocation: (
    loc: google.maps.LatLngLiteral | google.maps.LatLng | null | undefined
  ) => void;
  onMarkerDragEnd: (coord: any, index: any, name: any) => void;
  selectedLocation:
    | google.maps.LatLngLiteral
    | google.maps.LatLng
    | null
    | undefined;
}) => {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const { zoom, bounds } = useMapZoomAndBounds(map);

  useEffect(() => {
    if (map && !clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer?.current?.clearMarkers();
    clusterer?.current?.addMarkers(Object.values(markersRef.current));
  }, [clusterer.current, props.pois, zoom, bounds]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }
  };

  return (
    <>
      {props.pois.map((poi: Poi, index) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          onClick={() => props.onDeleteLocation(poi.location)}
          onDragEnd={() => {
            props.onMarkerDragEnd(poi.location, index, poi.name);
          }}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default PoiMarkers;
