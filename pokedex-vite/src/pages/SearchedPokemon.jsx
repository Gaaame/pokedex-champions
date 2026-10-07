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

// NUMBER OF MOVES TO LOAD AT A TIME
const MOVES_PER_PAGE = 20;

const getIdFromUrl = (url) => {
  return url.split("/").filter(Boolean).pop();
};

const getBaseStat = (statsArray, name) => {
  return statsArray.find((s) => s.stat.name === name)?.base_stat ?? 0;
};

const SearchedPokemon = () => {
  const { pokemon } = useParams();

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

  /*
   * FETCH POKEMON + SPECIES
   */
  useEffect(() => {
    let cancelled = false;

    const fetchPokemon = async () => {
      setLoading(true);
      setError(false);

      // Reset moves when changing Pokémon
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
        // Using pokemonData.species.url allows Mega Forms
        // and other alternate forms to load correctly.
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

        // IMPORTANT:
        // We finish the main page loading here.
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

  /*
   * FETCH MOVES
   *
   * This runs separately from the main Pokémon request.
   *
   * Only MOVES_PER_PAGE moves are requested at a time.
   */
  useEffect(() => {
    if (!selectedPokemon) return;

    let cancelled = false;

    const fetchMoves = async () => {
      setMovesLoading(true);

      try {
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

  /*
   * LOAD MORE MOVES
   */
  const handleLoadMoreMoves = () => {
    if (movesLoading || !selectedPokemon) {
      return;
    }

    setMoveOffset((currentOffset) => currentOffset + MOVES_PER_PAGE);
  };

  /*
   * LOADING
   */
  if (loading) {
    return <LoadingScreen />;
  }

  /*
   * ERROR
   */
  if (error || !selectedPokemon || !species) {
    return <ErrorScreen />;
  }

  /*
   * GENUS
   */
  const genus =
    species.genera.find((item) => item.language.name === "en")?.genus ||
    "Unknown Pokémon";

  /*
   * FORMS
   */
  const nonDefaultVarieties = species.varieties.filter((v) => !v.is_default);

  const megaForms = nonDefaultVarieties.filter((v) =>
    v.pokemon.name.includes("-mega"),
  );

  const alternateForms = nonDefaultVarieties.filter(
    (v) => !v.pokemon.name.includes("-mega"),
  );

  /*
   * HERO IMAGE
   */
  const heroImage =
    selectedPokemon.sprites.other?.home?.front_default ||
    selectedPokemon.sprites.front_default;

  /*
   * CHECK IF MORE MOVES EXIST
   */
  const hasMoreMoves =
    moveOffset + MOVES_PER_PAGE < selectedPokemon.moves.length;

  return (
    <div className="searched-pokemon">
      {/* BACK BUTTON */}
      <div className="searched-pokemon_header">
        <Link to="/">
          <Button label="Back" />
        </Link>
      </div>

      {/* HERO */}
      <div className="pokemon-details">
        <div className="searched-pokemon_info">
          <h4>{selectedPokemon.name}</h4>

          <h3>The {genus}</h3>

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

      {/* CONTENT */}
      <div className="pokemon-content">
        {/* STATS */}
        <div className="content-card stats-card">
          <Stats stats={stats} />
        </div>

        {/* ABILITIES + FORMS */}
        <div className="pokemon-content_row">
          {/* ABILITIES */}
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

          {/* MEGA FORMS */}
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

          {/* ALTERNATE FORMS */}
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

        {/* MOVES */}
        <div className="content-card moves-card">
          <h3>Moves</h3>

          {/* LOADING */}
          {movesLoading && moves.length === 0 && <p>Loading moves...</p>}

          {/* MOVES */}
          {moves.length > 0 && (
            <div className="move-list">
              {moves.map((move) => (
                <div className="move-item" key={move.id}>
                  {/* MOVE NAME */}
                  <div className="move-name">
                    {move.name.replaceAll("-", " ")}
                  </div>

                  {/* MOVE DETAILS */}
                  <div className="move-details">
                    {/* TYPE */}
                    <span
                      className="move-type"
                      style={{
                        backgroundColor: colours[move.type?.name] || "#777",
                      }}
                    >
                      {move.type?.name || "Unknown"}
                    </span>

                    {/* POWER */}
                    <span>
                      <strong>Power:</strong> {move.power ?? "—"}
                    </span>

                    {/* ACCURACY */}
                    <span>
                      <strong>Accuracy:</strong> {move.accuracy ?? "—"}
                    </span>

                    {/* PP */}
                    <span>
                      <strong>PP:</strong> {move.pp ?? "—"}
                    </span>

                    {/* CATEGORY */}
                    <span className="move-category">
                      {move.damage_class?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NO MOVES */}
          {!movesLoading && moves.length === 0 && <p>No moves found.</p>}

          {/* LOAD MORE */}
          {hasMoreMoves && (
            <div className="moves-load-more">
              <Button
                label={movesLoading ? "Loading..." : "Show More Moves"}
                onClick={handleLoadMoreMoves}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchedPokemon;
