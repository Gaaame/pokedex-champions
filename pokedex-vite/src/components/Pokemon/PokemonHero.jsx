import React from "react";

const PokemonHero = ({ pokemon, genus, colours }) => {
  const heroImage =
    pokemon.sprites.other?.home?.front_default || pokemon.sprites.front_default;

  return (
    <div className="pokemon-details">
      <div className="searched-pokemon_info">
        <h4>{pokemon.name}</h4>

        <h3>The {genus}</h3>

        <div className="type">
          {pokemon.types.map((type) => (
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
        <img src={heroImage} alt={pokemon.name} />
      </div>
    </div>
  );
};

export default PokemonHero;
