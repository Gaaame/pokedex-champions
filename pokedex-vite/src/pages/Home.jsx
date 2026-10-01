import React, { useState, useEffect } from "react";

// components
import Header from "../components/Header";
import Feed from "../components/Feed";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);

  const [offset, setOffset] = useState(() => {
    const storedOffset = sessionStorage.getItem("offset");
    return storedOffset ? parseInt(storedOffset, 10) : 0;
  });

  // Page navigation

  // Next Page
  function handleNextPage() {
    const newOffset = offset + 50;
    setOffset(newOffset);
    sessionStorage.setItem("offset", newOffset.toString());
  }

  // Previous Page
  function handlePreviousPage() {
    const newOffset = offSet <= 50 ? 0 : offset - 50;
    setOffset(newOffset);
    sessionStorage.setItem("offset", newOffset.toString());
  }

  useEffect(() => {
    async function fetchPokemon() {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      setPokemons(data.results);
    }

    fetchPokemon();
  }, [offset]);

  return (
    <div className="Home maxWidth">
      <Header />

      <Feed pokemons={pokemons} />

      <div className="pagination">
        <button
          className="btn"
          onClick={() => setOffset((prev) => Math.max(prev - 50, 0))}
          disabled={offset === 0}
        >
          Prev
        </button>

        <button className="btn" onClick={() => setOffset((prev) => prev + 50)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
