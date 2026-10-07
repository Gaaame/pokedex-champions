import React from "react";

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";

const getIdFromUrl = (url) => {
  return url.split("/").filter(Boolean).pop();
};

const PokemonForms = ({ megaForms, alternateForms }) => {
  return (
    <>
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
    </>
  );
};

export default PokemonForms;
