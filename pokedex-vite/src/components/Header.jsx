import React from "react";

//Components
import logo from "../assets/pokedex-logo.png";
import Button from "./Button";

//Styles
import "../css/Header.css";

function Header() {
  return (
    <header>
      <nav>
        <img src={logo} alt="Pokemon Logo" />
        <div className="search-container">
          <input type="text" placeholder="Search Pokemon" />
          <Button label={"Search"} />
        </div>
      </nav>
    </header>
  );
}

export default Header;
