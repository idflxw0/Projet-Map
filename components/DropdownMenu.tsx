import React, { useEffect, useRef, useState } from "react";
import { isUserLoggedIn, logout } from "./Sign_in";
import styled from 'styled-components';

interface DropdownIconProps extends React.HTMLProps<HTMLDivElement> {
  backgroundImage: string;
}

const DropdownIcon = styled.div<DropdownIconProps>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-image: url('${props => props.backgroundImage}');
    background-size: cover;
    background-position: center;
    cursor: pointer;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
`;

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  isLoggedIn = isUserLoggedIn();
  let defaultProfilePic = isLoggedIn ? "/pp.jpg" : "logout.jpg";
  const setLoggedout = () => {
    logout();
    setIsLoggedIn(false);
    window.location.reload();
  }

  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  console.log(defaultProfilePic);
  return (
    <div ref={dropdownRef}>
      <DropdownIcon
        className={`dropdown-icon${isOpen ? ' active' : ''}`}
        onClick={toggleDropdown}
        backgroundImage={defaultProfilePic}
      />
      {isOpen && (
        <div className="dropdown-content" onDoubleClick={handleDoubleClick}>
          {isLoggedIn ? (
            <>
              <a href="/profile">Profile</a>
              <a href="/settings">Settings</a>
              <a href="#" onClick={setLoggedout}>Logout</a>
            </>
          ) : (
            <>
              <a href="./SignInPage">Login</a>
              <a href="./SignInPage">Sign Up</a>
            </>
          )}
        </div>
      )}
    </div>
  );
};
