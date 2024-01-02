const commutesPerYear = 260 * 2;
const litresPerKM = 10 / 100;
const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;
const co2PerLitre = 2.3; // Example: assuming 2.3 kg of CO2 per liter of fuel


type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );
  const cost = Math.floor(
    (leg.distance.value / 1000) * litreCostKM * commutesPerYear
  );

  const co2Emissions = Math.floor(
    (leg.distance.value / 1000) * litresPerKM * co2PerLitre
  );

  return (
    <div>
      <p>
        This home is <span className="highlight">{leg.distance.text}</span> away
        from your office. That would take{" "}
        <span className="highlight">{leg.duration.text}</span> each direction.
      </p>

      {/*<p>
        That is <span className="highlight">{days} days</span> in your car each
        year at a cost of{" "}
        <span className="highlight">
          ${new Intl.NumberFormat().format(cost)}
        </span>
        .
      </p>*/}

      <p>
        The estimated CO2 emissions for the ride would be{" "}
        <span className="highlight">
          {new Intl.NumberFormat().format(co2Emissions)} kg
        </span>{" "}
        of CO2 per trip.
      </p>
    </div>
  );
}
