const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;
const co2PerLitre = 2.3; // Example: assuming 2.3 kg of CO2 per liter of fuel

import { CustomTravelMode } from "./map";

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
  travelMode: CustomTravelMode;
};

export default function Distance({ leg, travelMode }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const calculateCO2Emissions = (distance: number, travelMode: CustomTravelMode) => {
    const emissionFactors = {
      DRIVING: 2.3,      // Emission factor for driving (kg CO2 per km, adjust as needed)
      WALKING: 0.01,        // Assuming walking doesn't use fuel (negligible CO2 emissions)
      BICYCLING: 0.5,   // Assuming low emissions for bicycling (adjust as needed)
      TRANSIT: 0.01,
    };

    const litresPerKM = {
      DRIVING: 0.12,     // Litres of fuel per km for driving (adjust as needed)
      WALKING: 0,        // No fuel consumption for walking
      BICYCLING: 0,      // No fuel consumption for bicycling
      TRANSIT : 0.12,
    };

    if (travelMode === "WALKING") {
      // For walking, assuming negligible emissions
      const co2Emission = (distance / 1000) * emissionFactors[travelMode];
      return Math.floor(co2Emission);
    } else if (travelMode === "BICYCLING") {
      // For bicycling, assuming low emissions
      const co2Emission = (distance / 10000) * emissionFactors[travelMode];
      return Math.floor(co2Emission);
    } else if(travelMode === "TRANSIT"){
      // For transit, assuming low emissions
      const co2Emission = (distance / 10000) * emissionFactors[travelMode];
      return Math.floor(co2Emission);

    } else {
      // For other modes (e.g., DRIVING), calculate based on fuel consumption
      const co2Emission = (distance / 1000) * litresPerKM[travelMode] * emissionFactors[travelMode];
      return Math.floor(co2Emission);
    }
  };

  const co2Emissions = calculateCO2Emissions(leg.distance.value, travelMode);

  return (
    <div>
      <p>
        Distance du chemin : <span className="highlight">{leg.distance.text}</span> entre les points. Durée du trajet estimée à{" "}
        <span className="highlight">{leg.duration.text}</span>.
      </p>

      <p>
        Émission de CO2 estimée pour le trajet est de {" "}
        <span className="highlight">
          {co2Emissions !== undefined ? new Intl.NumberFormat().format(co2Emissions) : ''} kg
        </span>{" "}
       de CO2 par trajet.
      </p>
    </div>
  );
}
