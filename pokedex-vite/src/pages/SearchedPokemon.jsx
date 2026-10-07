import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// COMPONENTS
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import Button from "../components/Button";
import Stats from "../components/Stats";

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

// GET SPRITES
const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";

const getIdFromUrl = (url) => url.split("/").filter(Boolean).pop();

const getBaseStat = (statsArray, name) =>
  statsArray.find((s) => s.stat.name === name)?.base_stat ?? 0;

const SearchedPokemon = () => {
  const { pokemon } = useParams();

  const [moves, setMoves] = useState([]);
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
    let cancelled = false;

    async function fetchPokemon() {
      setLoading(true);
      setError(false);

      try {
        // Fetch the selected Pokémon/form
        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
        );

        if (!pokemonResponse.ok) {
          throw new Error("Pokemon not found");
        }

        const pokemonData = await pokemonResponse.json();

        // Fetch the base species using the species URL
        // returned by the Pokémon endpoint.
        const speciesResponse = await fetch(pokemonData.species.url);

        if (!speciesResponse.ok) {
          throw new Error("Pokemon species not found");
        }

        const speciesData = await speciesResponse.json();

        // Fetch detailed information for every move
        const moveResults = await Promise.allSettled(
          pokemonData.moves.map(async (item) => {
            const response = await fetch(item.move.url);

            if (!response.ok) {
              throw new Error(`Failed to fetch ${item.move.name}`);
            }

            return response.json();
          }),
        );

        const successfulMoves = moveResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        setMoves(successfulMoves);

        if (cancelled) return;

        setSelectedPokemon(pokemonData);
        setSpecies(speciesData);
        setMoves(moveResults);

        setStats({
          // Height: decimeters → feet
          height: (pokemonData.height / 3.048).toFixed(1),

          // Weight: hectograms → kilograms
          weight: (pokemonData.weight / 10).toFixed(1),

          exp: pokemonData.base_experience,

          hp: getBaseStat(pokemonData.stats, "hp"),
          attack: getBaseStat(pokemonData.stats, "attack"),
          defence: getBaseStat(pokemonData.stats, "defense"),
          splAttack: getBaseStat(pokemonData.stats, "special-attack"),
          splDefence: getBaseStat(pokemonData.stats, "special-defense"),
          speed: getBaseStat(pokemonData.stats, "speed"),
        });

        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError(true);
        setLoading(false);
      }
    }

    fetchPokemon();

    return () => {
      cancelled = true;
    };
  }, [pokemon]);

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error || !selectedPokemon || !species) {
    return <ErrorScreen />;
  }

  // English genus
  const genus = species.genera.find(
    (item) => item.language.name === "en",
  )?.genus;

  // Split varieties once
  const nonDefaultVarieties = species.varieties.filter((v) => !v.is_default);

  const megaForms = nonDefaultVarieties.filter((v) =>
    v.pokemon.name.includes("-mega"),
  );

  const alternateForms = nonDefaultVarieties.filter(
    (v) => !v.pokemon.name.includes("-mega"),
  );

  // Pokémon hero image
  const heroImage =
    selectedPokemon.sprites.other?.home?.front_default ||
    selectedPokemon.sprites.front_default;

  return (
    <div className="searched-pokemon">
      {/* Header */}
      <div className="searched-pokemon_header">
        <Link to="/">
          <Button label="Back" />
        </Link>
      </div>

      {/* Pokemon Hero */}
      <div className="pokemon-details">
        <div className="searched-pokemon_info">
          <h4>{selectedPokemon.name}</h4>

          <h3>The {genus}</h3>

          {/* Types */}
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
        </div>

        <div className="previewImage">
          <img src={heroImage} alt={selectedPokemon.name} />
        </div>
      </div>

      {/* Pokemon Information */}
      <div className="pokemon-content">
        {/* Row 1: Stats */}
        <div className="content-card stats-card">
          <Stats stats={stats} />
        </div>

        {/* Row 2: Abilities | Mega Forms | Alternate Forms */}
        <div className="pokemon-content_row">
          {/* Abilities */}
          <div className="content-card abilities">
            <h3>Abilities</h3>

            <div className="ability-list">
              {selectedPokemon.abilities.map((item) => (
                <span key={item.ability.name}>
                  {item.ability.name.replaceAll("-", " ")}

                  {item.is_hidden && " (Hidden)"}
                </span>
              ))}
            </div>
          </div>

          {/* Mega Forms */}
          {megaForms.length > 0 && (
            <div className="content-card mega-forms">
              <h3>Mega Forms</h3>

              <div className="mega-form-list">
                {megaForms.map((variety) => (
                  <div className="mega-form" key={variety.pokemon.name}>
                    <img
                      src={`${SPRITE_BASE}/${getIdFromUrl(
                        variety.pokemon.url,
                      )}.png`}
                      alt={variety.pokemon.name}
                    />

                    <span>
                      {variety.pokemon.name
                        .replace("-mega", " Mega")
                        .replaceAll("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternate Forms */}
          {alternateForms.length > 0 && (
            <div className="content-card alternate-forms">
              <h3>Alternate Forms</h3>

              <div className="alternate-form-list">
                {alternateForms.map((variety) => (
                  <div className="alternate-form" key={variety.pokemon.name}>
                    <img
                      src={`${SPRITE_BASE}/${getIdFromUrl(
                        variety.pokemon.url,
                      )}.png`}
                      alt={variety.pokemon.name}
                    />

                    <span>{variety.pokemon.name.replaceAll("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Moves */}
        <div className="content-card moves-card">
          <h3>Moves</h3>

          {moves.length > 0 ? (
            <div className="move-list">
              {moves.map((move) => (
                <div className="move-item" key={move.id}>
                  <div className="move-name">
                    {move.name.replaceAll("-", " ")}
                  </div>

                  <div className="move-details">
                    <span
                      className="move-type"
                      style={{
                        backgroundColor: colours[move.type.name],
                      }}
                    >
                      {move.type.name}
                    </span>

                    <span>
                      <strong>Power:</strong> {move.power ?? "—"}
                    </span>

                    <span>
                      <strong>Accuracy:</strong> {move.accuracy ?? "—"}
                    </span>

                    <span>
                      <strong>PP:</strong> {move.pp ?? "—"}
                    </span>

                    <span className="move-category">
                      {move.damage_class.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No moves found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchedPokemon;
