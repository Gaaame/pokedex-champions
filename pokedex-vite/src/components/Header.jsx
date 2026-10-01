import React from "react";

//Components
import logo from "../assets/Pokeball-PNG.png";
import Button from "./Button.jsx";

//Styles
import "../css/Header.css";

function Header() {
  return (
    <header>
      <nav>
        <img className="logo" src={logo} alt="Pokemon Logo" />
        <div className="search-container">
          <input type="text" placeholder="Search Pokemon" />
          <Button label={"Search"} />
        </div>
      </nav>
    </header>
  );
}

export default Header;
