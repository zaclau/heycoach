import React from 'react';
import "./headerUser.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../../components/searchBar/SearchBar";

const Header = ({ type }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/listings", { state: { searchTerm } });
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        
        {type !== "list" && (
          <>
            <h1 className="headerTitle text-black text-center fw-bold my-5">
              Welcome to your HeyCoach Account!
            </h1>
            <SearchBar 
              setSearchTerm={setSearchTerm} 
              searchTerm={searchTerm} 
              onSearch={handleSearch} />
        </>
        )}
      </div>
    </div>
  );
};

export default Header;
