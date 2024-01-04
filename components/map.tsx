import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import MainComponent from './MainComponent';


type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [depart, setDepart] = useState<LatLngLiteral>();
  const [arriver, setArriver] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const [calculatedDistances, setCalculatedDistances] = useState<number[]>([]);
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 48.864716, lng: 2.349014}),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "9dd822bc7a3962da",
      disableDefaultUI: false,
      clickableIcons: true,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const houses = useMemo(() => generateHouses(center), [center]);
  const calculateDistances = () => {
    const distances: number[] = [];

    houses.forEach((house) => {
      fetchDirections(house);
      // Assuming setDirections sets the distance in state
      // Modify accordingly based on your implementation
      distances.push(/* Get distance from state or any other method */);
    });

    setCalculatedDistances(distances);
  };

  const fetchDirections = (house: LatLngLiteral) => {
    if (!depart || !arriver) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: depart,
        destination: arriver,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>destination</h1>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        {!depart && <div className="Text">Entrer l'adress de depart</div>}
        <Places
          setOffice={(position) => {
            setDepart(position);
            mapRef.current?.panTo(position);
          }}
         showLocateMeButton/>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        {!arriver && <div className="Text">entrer l'adress de votre destination</div>}
        <Places
          setOffice={(position) => {
            setArriver(position);
            mapRef.current?.panTo(position);
          }}
          showLocateMeButton={false} // Disable the button for the second Places component

        />
        <button onClick={calculateDistances} className="Button">Calculate Distances</button>
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>


      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {depart && (
            <>
              <Marker position={depart}>
                <img src={process.env.PUBLIC_URL + "/location.png"} alt="actual Location" />
              </Marker>
              <Marker position={arriver}>
                <img src={process.env.PUBLIC_URL + "/location.png"} alt="actual Location" />
              </Marker>

              {/*<MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>*/}

              {/*<Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} /> */}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
