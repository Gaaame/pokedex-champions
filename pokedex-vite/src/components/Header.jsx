import React, { useState } from "react";
import { Link } from "react-router-dom";

//Components
import logo from "../assets/Pokeball-PNG.png";
import Button from "./Button.jsx";

//Styles
import "../css/Header.css";

//Search

const Header = () => {
  const [query, setQuery] = useState("");
  return (
    <header className>
      <nav>
        <img className="logo" src={logo} alt="Pokemon Logo" />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to={`/${query}`}>
            <Button label={"Search"} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
