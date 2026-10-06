import React, { useState, useEffect } from "react";

// components
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";

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
  // Limit to pokemon champions roster
  const championsMC = [
    // Gen 1
    3, 6, 9, 15, 18, 24, 25, 26, 36, 38, 40, 45, 53, 59, 65, 68, 71, 80, 83, 94,
    115, 121, 122, 127, 128, 130, 132, 134, 135, 136, 142, 143, 149,

    // Gen 2
    154, 157, 160, 168, 181, 184, 186, 196, 197, 199, 205, 208, 211, 212, 214,
    227, 229, 248,

    // Gen 3
    254, 257, 260, 279, 282, 302, 303, 306, 308, 310, 317, 319, 323, 324, 334,
    350, 351, 354, 358, 359, 362, 373, 376,

    // Gen 4
    389, 392, 395, 398, 405, 407, 409, 411, 428, 442, 445, 448, 450, 454, 460,
    461, 464, 470, 471, 472, 473, 475, 478, 479,

    // Gen 5
    497, 500, 503, 505, 508, 510, 512, 513, 514, 518, 530, 531, 534, 545, 547,
    553, 560, 563, 569, 571, 579, 584, 587, 604, 609, 614, 618, 623, 635, 637,

    // Gen 6
    652, 655, 658, 660, 663, 666, 668, 670, 671, 673, 675, 676, 678, 681, 683,
    684, 687, 689, 691, 693, 695, 697, 698, 700, 701, 702, 706, 707, 709, 711,
    713, 715,

    // Gen 7
    724, 727, 730, 733, 740, 745, 748, 750, 752, 758, 763, 765, 766, 768, 778,
    780, 784,

    // Gen 8
    812, 815, 818, 823, 828, 841, 842, 844, 849, 853, 855, 858, 861, 863, 865,
    866, 867, 869, 870, 871, 876, 877, 887,

    // Gen 9
    899, 900, 902, 903, 904, 908, 911, 914, 923, 925, 930, 931, 934, 936, 937,
    939, 943, 952, 956, 959, 964, 968, 970, 972, 979, 981, 998, 1000, 1013,
    1018, 1019,
  ];

  const ITEMS_PER_PAGE = 50; // species per page (forms add extra cards)

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

  // Next Page
  function handleNextPage() {
    const nextOffset = offset + ITEMS_PER_PAGE;

    if (nextOffset >= championsMC.length) {
      return;
    }

    setOffset(nextOffset);
    sessionStorage.setItem("offset", nextOffset.toString());
  }

  // Previous Page
  function handlePreviousPage() {
    const previousOffset = Math.max(0, offset - ITEMS_PER_PAGE);

    setOffset(previousOffset);
    sessionStorage.setItem("offset", previousOffset.toString());
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

        // 2. Collect every allowed variety (default, megas, regionals...)
        const varieties = speciesList.flatMap((species) =>
          species.varieties
            .filter((v) => isAllowedForm(v.pokemon.name, v.is_default))
            .map((v) => ({
              speciesId: species.id,
              url: v.pokemon.url,
            })),
        );

        // 3. Fetch the actual pokemon data for each variety
        const pokemonResults = await Promise.allSettled(
          varieties.map(async (v) => {
            const data = await getJSON(v.url);
            return { ...data, speciesId: v.speciesId };
          }),
        );

        const pokemonData = pokemonResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value)
          // keep dex order, with forms right after their base species
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

          <div className="pagination">
            <button
              className="btn"
              onClick={handlePreviousPage}
              disabled={offset === 0}
            >
              Prev
            </button>

            <button
              className="btn"
              onClick={handleNextPage}
              disabled={offset + ITEMS_PER_PAGE >= championsMC.length}
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
