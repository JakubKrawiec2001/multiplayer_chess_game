import { useGameStore } from "../stores/GameStore";
import Loading from "./Loading";
import useCloseCurrentGame from "../hooks/useCloseCurrentGame";

const GameStatus = ({ winner, gameStatus }) => {
  const gameId = useGameStore((state) => state.gameId);
  const { closeCurrentGame, isLoading } = useCloseCurrentGame();

  let message = "";

  if (gameStatus === "Checkmate") {
    message = `Checkmate! ${winner} wins!`;
  } else if (gameStatus === "Draw") {
    message = "It's a draw!";
  } else {
    message = "Game Over";
  }

  const handleCloseCurrentGame = () => {
    closeCurrentGame(gameId);
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
