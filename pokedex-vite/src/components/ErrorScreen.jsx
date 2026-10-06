import React from "react";

const ErrorScreen = ({
  title = "Oh no! The wild error appeared!",
  message = "Something went wrong while fetching Pokémon. Please try again.",
  onRetry,
}) => {
  return (
    <div className="ErrorScreen" role="alert">
      <div className="ErrorScreen__ball" aria-hidden="true">
        <div className="ErrorScreen__ball-button" />
      </div>

      <h2 className="ErrorScreen__title">{title}</h2>
      <p className="ErrorScreen__message">{message}</p>

      <div className="ErrorScreen__actions">
        {onRetry && (
          <button className="btn" onClick={onRetry}>
            Try again
          </button>
        )}
        <button className="btn" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
