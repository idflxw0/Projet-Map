import React from 'react';
import { FaUtensils, FaHotel, FaChargingStation , FaLandmark, FaSubway, FaCapsules, FaMoneyBillAlt } from 'react-icons/fa'; // Updated import with correct icons
// Add a type for the props expected by IconBar
type IconBarProps = {
  onIconClick: (iconType: string) => void;
};

const IconBar: React.FC<IconBarProps> = ({ onIconClick }) => {
  return (
    <div className="icon-bar-container">
      <div className="icon-bar-custom">
        <button><FaUtensils />
          <span>Restaurants</span>
        </button>
        <button>
          <FaHotel /><span>Hotels</span>
        </button>
        <button onClick={() => onIconClick('charging')} >
          <FaChargingStation /><span>Charging station</span>
        </button>
        <button>
          <FaLandmark /><span>Museums</span>
        </button>
        <button>
          <FaSubway /><span>Transit</span>
        </button>
        <button>
          <FaCapsules /><span>Pharmacies</span>
        </button>
        <button>
          <FaMoneyBillAlt /><span>ATMs</span>
        </button>
      </div>
    </div>
  );
};

export default IconBar;
