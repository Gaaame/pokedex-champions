import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import logo from "../assets/Pokeball-PNG.png";
import Button from "./Button.jsx";

// Styles
import "../css/Header.css";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const search = query.trim().toLowerCase().replaceAll(" ", "-");

    // Don't navigate if search is empty
    if (!search) {
      return;
    }

    navigate(`/${search}`);
  };

  return (
    <header>
      <nav>
        <img className="logo" src={logo} alt="Pokemon Logo" />

        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Pokemon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button label="Search" />
        </form>
      </nav>
    </header>
  );
};

export default Header;
