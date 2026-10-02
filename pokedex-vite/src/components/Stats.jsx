import React from "react";
import Stat from "../components/Stat";
import "../css/SearchedPokemon.css";

const Stats = ({ stats }) => {
  return (
    <div className="stats">
      <Stat parameter={"Height"} value={stats.height} units={"ft"} />
      <Stat parameter={"Weight"} value={stats.weight} units={"kg"} />
      <Stat parameter={"Base Exp"} value={stats.exp} />
      <Stat parameter={"HP"} value={stats.hp} />
      <Stat parameter={"Attack"} value={stats.attack} />
      <Stat parameter={"Defence"} value={stats.defence} />
      <Stat parameter={"Special Attack"} value={stats.splAttack} />
      <Stat parameter={"Special Defence"} value={stats.splDefence} />
      <Stat parameter={"Speed"} value={stats.speed} />
    </div>
  );
};

export default Stats;
