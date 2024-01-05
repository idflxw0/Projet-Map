import React, { useRef, useState } from "react";
import Places from "./places";
import Distance from "./distance";
import { GoogleMap } from "@react-google-maps/api";
import DirectionsResult = google.maps.DirectionsResult;
import LatLngLiteral = google.maps.LatLngLiteral;

const MapControls = () => {
  const [depart, setDepart] = useState<LatLngLiteral | null>(null);
  const [arriver, setArriver] = useState<LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const mapRef = useRef<GoogleMap>();

  const calculateDistances = () => {
    // Add your logic to calculate distances
  };

  return (
    <div className="controls">
      <h1>destination</h1>

      {/* eslint-disable-next-line react/no-unescaped-entities */}
      {!depart && <div className="Text">Enter l'adresse de depart</div>}
      <Places
        setOffice={(position) => {
          setDepart(position);
          mapRef.current?.panTo(position);
        }}
        showLocateMeButton
      />

      {/* eslint-disable-next-line react/no-unescaped-entities */}
      {!arriver && <div className="Text">Entrer l'adresse de votre destination</div>}
      <Places
        setOffice={(position) => {
          setArriver(position);
          mapRef.current?.panTo(position);
        }}
        showLocateMeButton={false}
      />

      <button onClick={calculateDistances} className="Button">
        Calculate Distances
      </button>

      {directions && <Distance leg={directions.routes[0].legs[0]} />}

      {/*<FullScreenButton />  Assuming you have a FullScreenButton component */}
    </div>
  );
};

export default MapControls;
