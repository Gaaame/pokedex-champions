import React from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import Button from "../components/Button";

const SearchedPokemon = () => {
  const { pokemon } = useParams();
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // pokeapi url
    const apiUrl = `https://pokeapi.co/api/v2/pokemon${pokemon}`;

    // error catching
    async function fetchPokemon() {
      setLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error occured!!");
        const data = await response.json();

        setSelectedPokemon(data);

        setTimeout(() => {
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        setError(true);
      }

      fetchPokemon();
    }
  }, [pokemon]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;
  return (
    <div className="searched-pokemon">
      <div className="searched-pokemon_header">
        <Link to={"/"}>
          <Button label="Back" />
        </Link>
      </div>
    </div>
  );
};

export default SearchedPokemon;
