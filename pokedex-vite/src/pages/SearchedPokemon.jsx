import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import Button from "../components/Button";
import "../css/SearchedPokemon.css";
import Stats from "../components/Stats";

// TYPE COLORS
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
  const [species, setSpecies] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [stats, setStats] = useState({
    height: 0,
    weight: 0,
    exp: 0,
    hp: 0,
    attack: 0,
    defence: 0,
    splAttack: 0,
    splDefence: 0,
    speed: 0,
  });

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      setError(false);

      try {
        // Fetch both Pokémon and species data
        const [pokemonResponse, speciesResponse] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`),
        ]);

        if (!pokemonResponse.ok || !speciesResponse.ok) {
          throw new Error("Pokemon not found");
        }

        const pokemonData = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();

        // Store API data
        setSelectedPokemon(pokemonData);
        setSpecies(speciesData);

        // Store stats
        setStats({
          // Height: decimeters → feet
          height: (pokemonData.height / 3.048).toFixed(1),

          // Weight: hectograms → kilograms
          weight: (pokemonData.weight / 10).toFixed(1),

          // Base experience
          exp: pokemonData.base_experience,

          // Pokémon stats
          hp: pokemonData.stats[0].base_stat,
          attack: pokemonData.stats[1].base_stat,
          defence: pokemonData.stats[2].base_stat,
          splAttack: pokemonData.stats[3].base_stat,
          splDefence: pokemonData.stats[4].base_stat,
          speed: pokemonData.stats[5].base_stat,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [pokemon]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  // Get English genus
  const genus = species?.genera.find(
    (item) => item.language.name === "en",
  )?.genus;

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

          <h3>{genus}</h3>

          <div className="type">
            {selectedPokemon.types.map((type) => (
              <span
                key={type.type.name}
                style={{
                  backgroundColor: colours[type.type.name],
                }}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          <Stats stats={stats} />
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
