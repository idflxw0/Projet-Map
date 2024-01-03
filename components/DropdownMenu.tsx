import React, { useEffect, useRef, useState } from "react";
import{ isUserLoggedIn } from "./Sign_in";

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);
  isLoggedIn = isUserLoggedIn();
  // Specify the type of the ref as HTMLDivElement
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleDoubleClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion: event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef}>
      <div className={`dropdown-icon${isOpen ? ' active' : ''}`} onClick={toggleDropdown}>
        {/* Icon content here */}
      </div>
      {isOpen && (
        <div className="dropdown-content" onDoubleClick={handleDoubleClick}>
          {isLoggedIn ? (
            <>
              <a href="/profile">Profile</a>
              <a href="/settings">Settings</a>
              <a href="/logout" onClick={() => setIsLoggedIn(false)}>Logout</a> {/* Implement logout logic here */}
            </>
          ) : (
            <>
              <a href="./SignInPage" onClick={() => setIsLoggedIn(true)}>Login</a> {/* Implement login logic here */}
              <a href="./SignInPage">Sign Up</a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

