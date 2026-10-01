import React from "react";

import "../css/Feed.css";
import Card from "./Card";
import { Link } from "react-router-dom";

const Feed = ({ pokemons }) => {
  return (
    <section className="pokemon-feed">
      {pokemons?.map((pokemon, index) => (
        <Link to={""}>
          <Card data={pokemon} />
        </Link>
      ))}
    </section>
  );
};

export default Feed;
