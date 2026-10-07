import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// COMPONENTS
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import Button from "../components/Button";
import Stats from "../components/Stats";

import PokemonHero from "../components/Pokemon/PokemonHero";
import PokemonAbilities from "../components/Pokemon/PokemonAbilities";
import PokemonForms from "../components/Pokemon/PokemonForms";
import PokemonMoves from "../components/Pokemon/PokemonMoves";

// STYLES
import "../css/SearchedPokemon.css";
import "../css/Abilities.css";
import "../css/Forms.css";

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

// NUMBER OF MOVES TO LOAD AT A TIME
const MOVES_PER_PAGE = 20;

// GET ID FROM POKEMON API URL
const getIdFromUrl = (url) => {
  return url.split("/").filter(Boolean).pop();
};

// GET BASE STAT
const getBaseStat = (statsArray, name) => {
  return statsArray.find((stat) => stat.stat.name === name)?.base_stat ?? 0;
};

const SearchedPokemon = () => {
  const { pokemon } = useParams();

  // ========================================
  // STATE
  // ========================================

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [species, setSpecies] = useState(null);

  const [moves, setMoves] = useState([]);
  const [moveOffset, setMoveOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [movesLoading, setMovesLoading] = useState(false);
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

  // ========================================
  // FETCH POKEMON + SPECIES
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(false);

      // Reset moves when changing Pokemon
      setMoves([]);
      setMoveOffset(0);

      try {
        // FETCH POKEMON
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
        );

        if (!pokemonResponse.ok) {
          throw new Error("Pokemon not found");
        }

        const pokemonData = await pokemonResponse.json();

        if (cancelled) return;

        // FETCH SPECIES
        // Using pokemonData.species.url allows
        // Mega Forms and alternate forms to load correctly.
        const speciesResponse = await fetch(pokemonData.species.url);

        if (!speciesResponse.ok) {
          throw new Error("Species not found");
        }

        const speciesData = await speciesResponse.json();

        if (cancelled) return;

        // SET POKEMON
        setSelectedPokemon(pokemonData);

        // SET SPECIES
        setSpecies(speciesData);

        // SET STATS
        setStats({
          height: (pokemonData.height / 3.048).toFixed(1),
          weight: (pokemonData.weight / 10).toFixed(1),
          exp: pokemonData.base_experience,

          hp: getBaseStat(pokemonData.stats, "hp"),
          attack: getBaseStat(pokemonData.stats, "attack"),
          defence: getBaseStat(pokemonData.stats, "defense"),
          splAttack: getBaseStat(pokemonData.stats, "special-attack"),
          splDefence: getBaseStat(pokemonData.stats, "special-defense"),
          speed: getBaseStat(pokemonData.stats, "speed"),
        });

        // Main page loading is finished
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        console.error(err);

        setError(true);
        setLoading(false);
      }
    };

    fetchPokemon();

    return () => {
      cancelled = true;
    };
  }, [pokemon]);

  // ========================================
  // FETCH MOVES
  // ========================================

  useEffect(() => {
    if (!selectedPokemon) return;

    let cancelled = false;

    const fetchMoves = async () => {
      setMovesLoading(true);

      try {
        // Get only the current batch of moves
        const moveList = selectedPokemon.moves.slice(
          moveOffset,
          moveOffset + MOVES_PER_PAGE,
        );

        // No more moves
        if (moveList.length === 0) {
          setMovesLoading(false);
          return;
        }

        const moveResults = await Promise.allSettled(
          moveList.map(async (item) => {
            const response = await fetch(item.move.url);

            if (!response.ok) {
              throw new Error(`Failed to fetch ${item.move.name}`);
            }

            return response.json();
          }),
        );

        if (cancelled) return;

        // Keep only successful requests
        const successfulMoves = moveResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .filter((move) => move && move.name);

        // Add new moves instead of replacing existing moves
        setMoves((currentMoves) => [...currentMoves, ...successfulMoves]);
      } catch (err) {
        if (cancelled) return;

        console.error("Move fetch error:", err);
      } finally {
        if (!cancelled) {
          setMovesLoading(false);
        }
      }
    };

    fetchMoves();

    return () => {
      cancelled = true;
    };
  }, [selectedPokemon, moveOffset]);

  // ========================================
  // LOAD MORE MOVES
  // ========================================

  const handleLoadMoreMoves = () => {
    if (movesLoading || !selectedPokemon) {
      return;
    }

    setMoveOffset((currentOffset) => currentOffset + MOVES_PER_PAGE);
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return <LoadingScreen />;
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !selectedPokemon || !species) {
    return <ErrorScreen />;
  }

  // ========================================
  // GENUS
  // ========================================

  const genus =
    species.genera.find((item) => item.language.name === "en")?.genus ||
    "Unknown Pokémon";

  // ========================================
  // FORMS
  // ========================================

  const nonDefaultVarieties = species.varieties.filter(
    (variety) => !variety.is_default,
  );

  const megaForms = nonDefaultVarieties.filter((variety) =>
    variety.pokemon.name.includes("-mega"),
  );

  const alternateForms = nonDefaultVarieties.filter(
    (variety) => !variety.pokemon.name.includes("-mega"),
  );

  // ========================================
  // CHECK IF MORE MOVES EXIST
  // ========================================

  const hasMoreMoves =
    moveOffset + MOVES_PER_PAGE < selectedPokemon.moves.length;

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="searched-pokemon">
      {/* BACK BUTTON */}
      <div className="searched-pokemon_header">
        <Link to="/">
          <Button label="Back" />
        </Link>
      </div>

      {/* HERO */}
      <PokemonHero pokemon={selectedPokemon} genus={genus} colours={colours} />

      {/* CONTENT */}
      <div className="pokemon-content">
        {/* STATS */}
        <div className="content-card stats-card">
          <Stats stats={stats} />
        </div>

        {/* ABILITIES + FORMS */}
        <div className="pokemon-content_row">
          <PokemonAbilities abilities={selectedPokemon.abilities} />

          <PokemonForms megaForms={megaForms} alternateForms={alternateForms} />
        </div>

        {/* MOVES */}
        <PokemonMoves
          moves={moves}
          movesLoading={movesLoading}
          hasMoreMoves={hasMoreMoves}
          handleLoadMoreMoves={handleLoadMoreMoves}
          colours={colours}
        />
      </div>
    </div>
  );
};

export default SearchedPokemon;
