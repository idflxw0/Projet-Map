import React from 'react';
import { FaUtensils, FaHotel, FaRegCompass, FaLandmark, FaSubway, FaCapsules, FaMoneyBillAlt } from 'react-icons/fa'; // Updated import with correct icons

const IconBar = () => {
  return (
    <div className="icon-bar-container">
      <div className="icon-bar-custom">
        <button><FaUtensils /><span>Restaurants</span></button>
        <button><FaHotel /><span>Hotels</span></button>
        <button><FaRegCompass /><span>Things to do</span></button>
        <button><FaLandmark /><span>Museums</span></button>
        <button><FaSubway /><span>Transit</span></button>
        <button><FaCapsules /><span>Pharmacies</span></button>
        <button><FaMoneyBillAlt /><span>ATMs</span></button>

      </div>
    </div>
  );
};

export default IconBar;
