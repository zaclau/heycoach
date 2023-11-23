import React from 'react';
import { useState, useRef, useEffect } from "react";
import FilterModal from "../../components/filtermodal/FilterModal";
// import "./filteritem.css";
import "./filter.css";

const FilterItem = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="filter-item">
      <button className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </button>

      {open && props.children}
    </div>
  );
};

const Filter = ({ children, onApply, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(undefined);
  const buttonRef = useRef(undefined);
  const modalRef = useRef(undefined);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDropdownClick =
        dropdownRef.current && dropdownRef.current.contains(event.target);
      const isButtonClick =
        buttonRef.current && buttonRef.current.contains(event.target);
      const isModalClick =
        modalRef.current && modalRef.current.contains(event.target);

      if (isDropdownClick || isButtonClick || isModalClick) {
        /* If the ref is not defined or the user clicked on the menu, we don’t do anything. */
        return;
      }
      /* Otherwise we close the menu. */
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside); /* handle desktops */
    document.addEventListener("touchstart", handleClickOutside); /* handle touch devices */

    /* Event cleanup */
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); /* handle desktops */
      document.removeEventListener("touchstart", handleClickOutside); /* handle touch devices */
    };
  }, [dropdownRef, buttonRef, modalRef]);

  const handleApply = (event) => {
    setIsOpen(false);
    // onApply(event);
  };

  return (
    <div className="filter">
      <div
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="filter__button"
      >
        {label}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="filter__dropdown">
          <div style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
            {children}
          </div>

          <div className="filter__dropdown__actions">
            <button onClick={handleApply} className="filter__dropdown_button">
              Apply
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <FilterModal
          ref={modalRef}
          onApply={handleApply}
          onDismiss={() => setIsOpen(false)}
        >
          {children}
        </FilterModal>
      )}
    </div>
  );
};

export default Filter;

