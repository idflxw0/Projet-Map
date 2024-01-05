import { useState, useMemo, useCallback, useRef } from "react";
import IconBar from "./IconBar";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import locations from '../data/extracted_data.json';


type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [depart, setDepart] = useState<LatLngLiteral>();
  const [arriver, setArriver] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const [calculatedDistances, setCalculatedDistances] = useState<number[]>([]);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [visibleChargingStations, setVisibleChargingStations] = useState<Location[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
  const [showCharging, setShowCharging] = useState(false);
  const mapRef = useRef<google.maps.Map>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 48.864716, lng: 2.349014}),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "9dd822bc7a3962da",
      disableDefaultUI: false,
      clickableIcons: true,
      minZoom: 3,
    }),
    []
  );

  const onLoad = useCallback((map) =>{
    (mapRef.current = map);
    setBounds(map.getBounds());
  },[]);

  const onMarkerClick = (location: Location) => {
    setSelectedMarker(location);
  };

  type Location = {
    Xlatitude: string;
    Xlongitude: string;
    ad_station: string;
  };


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

  const isWithinRadius = (center: { lat: number; lng: number; }, location: { lat: number; lng: number; }, radius: number) => {
    const rad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth’s mean radius in kilometers

    const dLat = rad(location.lat - center.lat);
    const dLong = rad(location.lng - center.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(center.lat)) *
      Math.cos(rad(location.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d <= radius; // returns true if within radius, false otherwise
  };

  const handleIconClick = (iconType: string) => {
    if (iconType === 'charging') {
      showChargingStations();
    }

  };

  const showChargingStations = () => {
    if (showCharging) {
      setVisibleChargingStations([]);
      setShowCharging(false);

    } else {
      const stations = locations.filter((location) => {
        const loc = new google.maps.LatLng(parseFloat(location.Xlatitude), parseFloat(location.Xlongitude));
        return bounds && bounds.contains(loc); // Ensure bounds is not null
      }).map(location => ({
        Xlatitude: location.Xlatitude,
        Xlongitude: location.Xlongitude,
        ad_station: location.ad_station
      }));

      setVisibleChargingStations(stations);
      setShowCharging(true);
    }



  };


  return (
    <div className="container">
      <IconBar onIconClick={handleIconClick} />
      <div className="controls">
        <h1>destination</h1>
         eslint-disable-next-line react/no-unescaped-entities
        {!depart && <div className="Text">Entrer l'adress de depart</div>}
        <Places
          setOffice={(position) => {
            setDepart(position);
            mapRef.current?.panTo(position);
          }}
         showLocateMeButton/>
         eslint-disable-next-line react/no-unescaped-entities
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
          onIdle={() => {
            if (mapRef.current) {
              setBounds(mapRef.current.getBounds() as google.maps.LatLngBounds);
            }
          }}
        >
          {visibleChargingStations.map((station, index) => (
            <Marker
              key={index}
              position={{ lat: parseFloat(station.Xlatitude), lng: parseFloat(station.Xlongitude) }}
              onClick={() => onMarkerClick(station)}
            >
              {selectedMarker && selectedMarker.ad_station === station.ad_station && (
                <InfoWindow
                  position={{ lat: parseFloat(station.Xlatitude), lng: parseFloat(station.Xlongitude) }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="info-window-content">
                    {station.ad_station}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}

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
