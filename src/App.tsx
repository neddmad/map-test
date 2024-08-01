import { APIProvider, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "./components/PoiMarkers";
import "./App.css";
import { useState } from "react";
import { db } from "./config/firebase-config";
import { collection, addDoc, GeoPoint, Timestamp } from "firebase/firestore";

const GOOGLE_MAPS_API_KEY = "AIzaSyBmcAPsWeoNtQleh6fZn44UHUg-wGmUj5c";

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState<
    google.maps.LatLngLiteral | google.maps.LatLng | null | undefined
  >(null);

  const [listOfLocations, setListOfLocations] = useState<
    {
      name: string;
      location:
        | google.maps.LatLngLiteral
        | google.maps.LatLng
        | null
        | undefined;
    }[]
  >([
    {
      name: "364 Wilson St, Darlington NSW 2008, Австралия",
      location: { lat: -33.89321737944088, lng: 151.19178771972656 },
    },
  ]);
  const handleMapClick = async (MapProps: {
    type?: string;
    map?: google.maps.Map;
    detail: any;
  }) => {
    if (MapProps.detail.placeId) {
      const lat = MapProps.detail.latLng.lat;
      const lng = MapProps.detail.latLng.lng;

      setSelectedLocation({ lat, lng });

      try {
        const userQuestsRef = collection(db, "users", "USER_ID", "quests");
        await addDoc(userQuestsRef, {
          location: new GeoPoint(lat, lng),
          timestamp: Timestamp.fromDate(new Date()),
        });
        console.log("Quest added to Firestore");
      } catch (error: any) {
        console.error("Error adding quest to Firestore:", error.message);
      }
    } else {
      alert("Виберіть точну адресу");
    }
  };

  const onAddLocation = () => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === "OK") {
        if (results !== null && results[0]) {
          setListOfLocations([
            ...listOfLocations,
            {
              name: results[0].formatted_address,
              location: selectedLocation,
            },
          ]);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const onDeleteLocation = (
    loc: google.maps.LatLngLiteral | google.maps.LatLng | null | undefined
  ) => {
    let updatedList = listOfLocations.filter(
      (l) => loc?.lat !== l.location?.lat && loc?.lng !== l.location?.lng
    );
    setListOfLocations(updatedList);
  };
  const onDeleteAllLocations = () => {
    setListOfLocations([]);
  };

  const onMarkerDragEnd = (coord: any, index: any, name: any) => {
    const lat = coord.lat;
    const lng = coord.lng;

    setListOfLocations(
      (
        prevState
      ): {
        name: string;
        location:
          | google.maps.LatLngLiteral
          | google.maps.LatLng
          | null
          | undefined;
      }[] => {
        if (prevState[index] === index) {
          return { ...name, location: { lat, lng } };
        } else {
          return prevState;
        }
      }
    );
  };

  const formatted = listOfLocations.map((e) => {
    const lat = e.location?.lat !== undefined ? e.location.lat : "unknown-lat";
    const lng = e.location?.lng !== undefined ? e.location.lng : "unknown-lng";

    return {
      ...e,
      key: `${e.name}-${lat}-${lng}-${Math.random()}`,
    };
  });

  return (
    <div className="app">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <div className="map-container">
          <button onClick={onDeleteAllLocations}>Delete all locations</button>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            mapId="f8d776b07f3e0303"
            onClick={(MapProps) => {
              handleMapClick(MapProps);
              onAddLocation();
            }}
          >
            <PoiMarkers
              selectedLocation={selectedLocation}
              pois={formatted}
              onDeleteLocation={onDeleteLocation}
              onMarkerDragEnd={onMarkerDragEnd}
            />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

export default App;
