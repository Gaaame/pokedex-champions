import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchedPokemon from "./pages/SearchedPokemon";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:pokemon" element={<SearchedPokemon />} />
      </Routes>
    </div>
  );
};

export default App;
