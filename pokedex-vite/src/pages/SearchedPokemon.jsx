import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import Button from "../components/Button";

//TYPE COLORS
const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const SearchedPokemon = () => {
  const { pokemon } = useParams();

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    async function fetchPokemon() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Pokemon not found");
        }

        const data = await response.json();

        setSelectedPokemon(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [pokemon]);

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen />;

  return (
    <div className="searched-pokemon">
      <div className="searched-pokemon_header">
        <Link to="/">
          <Button label="Back" />
        </Link>
      </div>

      <div className="pokemon-details">
        <div className="searched-pokemon_info">
          <h4>{selectedPokemon.name}</h4>
          <div className="type">
            {selectedPokemon.types.map((type, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: colours[type.type.name],
                }}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="previewImage">
          <img
            src={selectedPokemon.sprites.other.home.front_default}
            alt={selectedPokemon.name}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchedPokemon;
