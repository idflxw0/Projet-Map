import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight,faCar, faWalking, faBicycle } from "@fortawesome/free-solid-svg-icons";

import { faChargingStation } from '@fortawesome/free-solid-svg-icons';
import chargingStationIcon from "../public/charging.png";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
type CustomTravelMode = "DRIVING" | "WALKING" | "BICYCLING";

const convertToTravelMode = (mode: CustomTravelMode): google.maps.TravelMode => {
  switch (mode) {
    case "DRIVING":
      return google.maps.TravelMode.DRIVING;
    case "WALKING":
      return google.maps.TravelMode.WALKING;
    case "BICYCLING":
      return google.maps.TravelMode.BICYCLING;
    default:
      throw new Error("Invalid travel mode");
  }
};

const ModeSelector: React.FC<{ onSelect: (mode: CustomTravelMode) => void }> = ({ onSelect }) => {
  const handleClick = (mode: CustomTravelMode) => {
    onSelect(mode);
  };

  return (
    <div className="mode-selector">
      <button onClick={() => handleClick("DRIVING")}>
        <FontAwesomeIcon icon={faCar} size="2x" />
      </button>
      <button onClick={() => handleClick("WALKING")}>
        <FontAwesomeIcon icon={faWalking} size="2x" />
      </button>
      <button onClick={() => handleClick("BICYCLING")}>
        <FontAwesomeIcon icon={faBicycle} size="2x" />
      </button>
    </div>
  );
};
export default function Map() {
  const [depart, setDepart] = useState<LatLngLiteral>();
  const [arriver, setArriver] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const [calculatedDistances, setCalculatedDistances] = useState<number[]>([]);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [visibleChargingStations, setVisibleChargingStations] = useState<Location[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
  const [showCharging, setShowCharging] = useState(false);
  const [currentIcon, setCurrentIcon] = useState('');
  const [zoomLevel, setZoomLevel] = useState(10); const [selectedTravelMode, setSelectedTravelMode] = useState<CustomTravelMode>("DRIVING");


  const mapRef = useRef<google.maps.Map>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 48.864716, lng: 2.349014}),
    []
  );
  // Inside the component function
  const [isControlsFolded, setIsControlsFolded] = useState(false);

  const toggleControls = () => {
    setIsControlsFolded((prevState) => !prevState);
  };

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "9dd822bc7a3962da",
      disableDefaultUI: true,
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


  const calculateDistances = () => {
    if (!depart || !arriver) {
      return;
    }

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: depart,
        destination: arriver,
        travelMode: convertToTravelMode(selectedTravelMode),
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          alert(`Il n'existe pas de chemin reliant les deux points`);
        }
      }
    );
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

  const handleIconClick = (iconType: string) => {
    if (iconType === 'charging') {
      setCurrentIcon('charging_station');
      showChargingStations();
    }
  };

  const handleTravelModeChange = (mode: CustomTravelMode) => {
    console.log("Selected Travel Mode:", mode);
    setSelectedTravelMode(mode);
  };



  const showChargingStations = () => {
    if (showCharging) {
      setVisibleChargingStations([]);
      setShowCharging(false);
      setCurrentIcon('');

    } else if (zoomLevel > 11){
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

  const countMarkersInView = () => {
    if (!bounds) {
      return 0;
    }
    return visibleChargingStations.filter(station => {
      const location = new google.maps.LatLng(parseFloat(station.Xlatitude), parseFloat(station.Xlongitude));
      return bounds.contains(location);
    }).length;
  };
  const clusterStyles = [
    {
      textColor: '#FFFFFF',
      url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
      height: 50,
      width: 50,
    },
    {
      textColor: '#FFFFFF',
      url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
      height: 60,
      width: 60,
    },
    {
      textColor: '#FFFFFF',
      url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
      height: 70,
      width: 70,
    },
  ];
  const [currentClusterStyle, setCurrentClusterStyle] = useState(clusterStyles[0]);

  const determineClusterStyle = (zoomLevel: number) => {
    if (zoomLevel > 10 && zoomLevel <= 11) {
      return clusterStyles[0];
    } else if (zoomLevel >= 7 && zoomLevel < 10) {
      return clusterStyles[1];
    } else if(zoomLevel < 7) {
      return clusterStyles[2];
    }
    return clusterStyles[0];
  };

  useEffect(() => {
    calculateDistances();
  }, [selectedTravelMode]);
  const [isClustererLoaded, setIsClustererLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the MarkerClusterer library
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@react-google-maps/markerclusterer@1.0.0/dist/index.min.js";
    script.async = true;
    script.onload = () => {
      setIsClustererLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="container">
      <IconBar onIconClick={handleIconClick} />
      <div className={`controls ${isControlsFolded ? 'folded' : ''}`}>
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
        <ModeSelector onSelect={handleTravelModeChange} />
        <button onClick={calculateDistances} className="Button">Calculate Distances</button>
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>

      <button onClick={toggleControls} className="FoldButton">
        {isControlsFolded ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronLeft} />}
      </button>

      <div className={`map ${isControlsFolded ? 'folded' : ''}`}>

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
          onZoomChanged={() => {
            if (mapRef.current) {
              const newZoomLevel = mapRef.current.getZoom();
              if (typeof newZoomLevel === 'number') {
                setZoomLevel(newZoomLevel);
                // console.log(newZoomLevel);
                const styleToUse = determineClusterStyle(newZoomLevel);
                setCurrentClusterStyle(styleToUse);
              }
            }
          }}
        >


        {visibleChargingStations.map((station, index) => {
          if (zoomLevel > 11) {
            return (<Marker
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
            );
          } else return null;

        })
        }
          {
            zoomLevel < 11 && (
              <MarkerClusterer styles={[currentClusterStyle]} >
                {(clusterer) =>
                  visibleChargingStations.map((station, index) => (
                    <Marker
                      key={index}
                      position={{
                        lat: parseFloat(station.Xlatitude),
                        lng: parseFloat(station.Xlongitude)
                      }}
                      clusterer={clusterer}
                      onClick={() => onMarkerClick(station)}
                    />
                  ))
                }
              </MarkerClusterer >
            )
          }

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
              <Marker
                position={depart}
                icon={process.env.PUBLIC_URL + "/charging.png"}
              />
              {arriver && (
                <Marker
                  position={arriver}
                  icon={process.env.PUBLIC_URL + "/location.png"}
                />
              )}




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


const mapContainerStyle = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const center = {
  ...mapContainerStyle,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};

const options = {
  ...mapContainerStyle,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};

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

const clusterStyles = [
  {
    textColor: 'white',
    url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="10" fill="#FF0000" /></svg>',
    height: 30,
    width: 30
  },
  // Add more styles for larger clusters if needed
];


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


