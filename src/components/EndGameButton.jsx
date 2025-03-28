import React from "react";
import { useGameStore } from "../stores/GameStore";
import useCloseCurrentGame from "../hooks/useCloseCurrentGame";

const EndGameButton = () => {
  const gameId = useGameStore((state) => state.gameId);
  const { closeCurrentGame } = useCloseCurrentGame();

  const handleCloseCurrentGame = () => {
    closeCurrentGame(gameId);
  };
  return (
    <button
      className="main-dark-btn text-sm md:text-base z-10 p-2"
      onClick={handleCloseCurrentGame}
    >
      Quit Game
    </button>
  );
};

export default EndGameButton;
