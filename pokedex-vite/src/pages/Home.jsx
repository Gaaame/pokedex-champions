import React, { useState, useEffect } from "react";

// components
import Header from "../components/Header";
import Feed from "../components/Feed";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);

  const [offset, setOffset] = useState(() => {
    const storedOffset = sessionStorage.getItem("offset");
    return storedOffset ? parseInt(storedOffset, 10) : 0;
  });

  const [loading, setLoading] = useState(true);

  // Next Page
  function handleNextPage() {
    const newOffset = offset + 50;

    setOffset(newOffset);
    sessionStorage.setItem("offset", newOffset.toString());
  }

  // Previous Page
  function handlePreviousPage() {
    const newOffset = offset <= 50 ? 0 : offset - 50;

    setOffset(newOffset);
    sessionStorage.setItem("offset", newOffset.toString());
  }

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);

      try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        setPokemons(data.results);

        // Small loading delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
        setLoading(false);
      }
    }

    fetchPokemon();
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
            <button className="btn" onClick={handlePreviousPage}>
              Prev
            </button>

            <button className="btn" onClick={handleNextPage}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
