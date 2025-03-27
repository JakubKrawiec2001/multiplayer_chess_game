import React, { useState } from "react";
import { useUserStore } from "../stores/UserStore";
import { useGameStore } from "../stores/GameStore";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/supabase";
import { toast } from "react-toastify";
import Loading from "./Loading";

const GameStatus = ({ winner, gameStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useUserStore((state) => state.logout);
  const resetCurrentGame = useGameStore((state) => state.resetCurrentGame);
  const gameId = useGameStore((state) => state.gameId);
  const navigate = useNavigate();
  let message = "";

  if (gameStatus === "Checkmate") {
    message = `Checkmate! ${winner} wins!`;
  } else if (gameStatus === "Draw") {
    message = "It's a draw!";
  } else {
    message = "Game Over";
  }

  const handleCloseCurrentGame = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("game")
        .delete()
        .eq("game_id", gameId);

      if (error) {
        toast(`Error while ending the game: ${error}`);
      } else {
        resetCurrentGame();
        logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Game error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col gap-10 items-center justify-center z-[999]">
      <p className="text-white font-black text-5xl">{message}</p>
      {isLoading ? (
        <Loading />
      ) : (
        <button
          className="bg-white text-main-dark-blue text-2xl font-black uppercase px-3 py-3 rounded-lg dark-btn-shadow cursor-pointer hover:bg-slate-200 transition-colors"
          onClick={handleCloseCurrentGame}
        >
          End game
        </button>
      )}
    </div>
  );
};

export default GameStatus;
