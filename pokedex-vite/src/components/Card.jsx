import React from "react";

const Card = ({ data }) => {
  // pokemon id
  const pokeId = data.id;

  // pokemon image
  const imgUrl =
    data.sprites?.other?.home?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`;

  return (
    <div className="card">
      <img src={imgUrl} alt={data.name} />

      <div className="text">
        <h4 className="name">
          {/* pokemon name */}

          {data.name}
        </h4>
      </div>
    </div>
  );
};

export default Card;
