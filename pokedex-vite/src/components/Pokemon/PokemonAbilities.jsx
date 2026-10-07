import React from "react";

const PokemonAbilities = ({ abilities }) => {
  return (
    <div className="content-card abilities">
      <h3>Abilities</h3>

      <div className="ability-list">
        {abilities.map((item) => (
          <span key={item.ability.name}>
            {item.ability.name.replaceAll("-", " ")}

            {item.is_hidden && " (Hidden)"}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonAbilities;
