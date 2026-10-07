import React, { useState, useEffect } from "react";

// components
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";
import championsMC from "../data/champions";

const API = "https://pokeapi.co/api/v2";

// Module-level cache so going back/forward a page doesn't refetch
const cache = new Map();

async function getJSON(url) {
  if (cache.has(url)) return cache.get(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  const data = await response.json();

  cache.set(url, data);

  return data;
}

// Edit this to match which forms Champions actually allows.
// Keeps default forms, megas (incl. mega-x/y/z), regionals, etc.
const EXCLUDED_FORMS =
  /-(gmax|totem|starter|cap|cosplay|rock-star|belle|pop-star|phd|libre|original|partner|world|eternamax|build|battle-bond)/;

function isAllowedForm(name, isDefault) {
  if (isDefault) return true;

  return !EXCLUDED_FORMS.test(name);
}

// Stricter alternative: only megas + regional forms
// function isAllowedForm(name, isDefault) {
//   return isDefault || /-(mega|alola|galar|hisui|paldea)/.test(name);
// }

const Home = () => {
  // Number of species displayed per page
  // Forms are added in addition to these species
  const ITEMS_PER_PAGE = 50;

  const [pokemons, setPokemons] = useState([]);

  const [offset, setOffset] = useState(() => {
    const storedOffset = sessionStorage.getItem("offset");

    if (!storedOffset) {
      return 0;
    }

    const parsedOffset = parseInt(storedOffset, 10);

    if (
      isNaN(parsedOffset) ||
      parsedOffset < 0 ||
      parsedOffset >= championsMC.length
    ) {
      return 0;
    }

    return parsedOffset;
  });

  const [loading, setLoading] = useState(true);

  // Pagination information
  const totalPages = Math.ceil(championsMC.length / ITEMS_PER_PAGE);

  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  // Change page
  function handlePageChange(page) {
    // Prevent going outside the available pages
    if (page < 1 || page > totalPages) {
      return;
    }

    const newOffset = (page - 1) * ITEMS_PER_PAGE;

    setOffset(newOffset);

    sessionStorage.setItem("offset", newOffset.toString());
  }

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    async function fetchPokemon() {
      setLoading(true);

      try {
        // Current page of species IDs from the Champions roster
        const currentIds = championsMC.slice(offset, offset + ITEMS_PER_PAGE);

        // 1. Fetch each species so we can see all of its forms
        const speciesResults = await Promise.allSettled(
          currentIds.map((id) => getJSON(`${API}/pokemon-species/${id}`)),
        );

        const speciesList = speciesResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);

        // 2. Collect every allowed variety
        // default, megas, regionals, etc.
        const varieties = speciesList.flatMap((species) =>
          species.varieties
            .filter((v) => isAllowedForm(v.pokemon.name, v.is_default))
            .map((v) => ({
              speciesId: species.id,
              url: v.pokemon.url,
            })),
        );

        // 3. Fetch the actual Pokémon data for each variety
        const pokemonResults = await Promise.allSettled(
          varieties.map(async (v) => {
            const data = await getJSON(v.url);

            return {
              ...data,
              speciesId: v.speciesId,
            };
          }),
        );

        const pokemonData = pokemonResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value)

          // Keep Pokédex order,
          // with forms right after their base species
          .sort((a, b) => a.speciesId - b.speciesId || a.id - b.id);

        if (isMounted) {
          setPokemons(pokemonData);

          // Small loading delay
          timeoutId = setTimeout(() => {
            if (isMounted) {
              setLoading(false);
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching Pokemon:", error);

        if (isMounted) {
          setPokemons([]);
          setLoading(false);
        }
      }
    }

    fetchPokemon();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [offset]);

  return (
    <div className="Home maxWidth">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />

          <Feed pokemons={pokemons} />

          {/* Pagination */}
          <div className="pagination">
            {/* Previous */}
            <button
              className="btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              className="btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
