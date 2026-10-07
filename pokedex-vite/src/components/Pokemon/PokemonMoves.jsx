import React from "react";
import Button from "../Button";

const PokemonMoves = ({
  moves,
  movesLoading,
  hasMoreMoves,
  handleLoadMoreMoves,
  colours,
}) => {
  return (
    <div className="content-card moves-card">
      <h3>Moves</h3>

      {movesLoading && moves.length === 0 && <p>Loading moves...</p>}

      {moves.length > 0 && (
        <div className="move-list">
          {moves.map((move) => (
            <div className="move-item" key={move.id}>
              <div className="move-name">{move.name.replaceAll("-", " ")}</div>

              <div className="move-details">
                <span
                  className="move-type"
                  style={{
                    backgroundColor: colours[move.type?.name] || "#777",
                  }}
                >
                  {move.type?.name || "Unknown"}
                </span>

                <span>
                  <strong>Power:</strong> {move.power ?? "—"}
                </span>

                <span>
                  <strong>Accuracy:</strong> {move.accuracy ?? "—"}
                </span>

                <span>
                  <strong>PP:</strong> {move.pp ?? "—"}
                </span>

                <span className="move-category">
                  {move.damage_class?.name || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!movesLoading && moves.length === 0 && <p>No moves found.</p>}

      {hasMoreMoves && (
        <div className="moves-load-more">
          <Button
            label={movesLoading ? "Loading..." : "Show More Moves"}
            onClick={handleLoadMoreMoves}
          />
        </div>
      )}
    </div>
  );
};

export default PokemonMoves;
