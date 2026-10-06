return (
  <div className="searched-pokemon">
    {/* ================================
        Header
    ================================= */}

    <div className="searched-pokemon_header">
      <Link to="/">
        <Button label="Back" />
      </Link>
    </div>

    {/* ================================
        Pokemon Hero
    ================================= */}

    <div className="pokemon-details">
      {/* Pokemon Information */}
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
      </div>

      {/* Pokemon Image */}
      <div className="previewImage">
        <img
          src={selectedPokemon.sprites.other.home.front_default}
          alt={selectedPokemon.name}
        />
      </div>
    </div>

    {/* ================================
        Pokemon Information
    ================================= */}

    <div className="pokemon-content">
      {/* Stats */}
      <div className="content-card stats-card">
        <Stats stats={stats} />
      </div>

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

      {/* Alternate Forms */}
      {species.varieties.filter((variety) => !variety.is_default).length >
        0 && (
        <div className="content-card alternate-forms">
          <h3>Alternate Forms</h3>

          <div className="alternate-form-list">
            {species.varieties
              .filter((variety) => !variety.is_default)
              .map((variety) => {
                const pokeId = variety.pokemon.url.split("/").slice(-2, -1)[0];

                return (
                  <div className="alternate-form" key={variety.pokemon.name}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`}
                      alt={variety.pokemon.name}
                    />

                    <span>{variety.pokemon.name.replaceAll("-", " ")}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mega Forms */}
      {species.varieties.filter((variety) =>
        variety.pokemon.name.includes("-mega"),
      ).length > 0 && (
        <div className="content-card mega-forms">
          <h3>Mega Forms</h3>

          <div className="mega-form-list">
            {species.varieties
              .filter((variety) => variety.pokemon.name.includes("-mega"))
              .map((variety) => {
                const pokeId = variety.pokemon.url.split("/").slice(-2, -1)[0];

                return (
                  <div className="mega-form" key={variety.pokemon.name}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`}
                      alt={variety.pokemon.name}
                    />

                    <span>
                      {variety.pokemon.name
                        .replace("-mega", " Mega")
                        .replace("-", " ")}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  </div>
);
