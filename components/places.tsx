import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { DropdownMenu } from "./DropdownMenu";
type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
  showLocateMeButton: boolean; // Optional prop to control the visibility of the button

};
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faLocationArrow } from "@fortawesome/free-solid-svg-icons";
export default function Places({ setOffice, showLocateMeButton = true }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setOffice({ lat, lng });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const results = await getGeocode({
            location: { lat: latitude, lng: longitude },
          });
          const address = results[0]?.formatted_address || '';
          setValue(address);
          setOffice({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <>
      <DropdownMenu />

      <div className="places-container">
        <Combobox onSelect={handleSelect}>
          <ComboboxInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            className="combobox-input"
            placeholder="Rechercher adresse..."
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>

        {showLocateMeButton && (
          <button className="locate-me-button" onClick={handleLocateMe}>
            <FontAwesomeIcon icon={faCrosshairs} size="2x" />
          </button>
        )}
      </div>

    </>
  );


}



