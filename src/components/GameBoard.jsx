import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const GameBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState("");

  const makeMove = (move) => {
    const newGame = new Chess(game.fen());
    const result = newGame.move(move);

    if (result) {
      setGame(newGame);
      setFen(newGame.fen());

      // Sprawdzenie, czy gra się zakończyła
      if (newGame.isCheckmate()) {
        setStatus("Szach-mat! Gra zakończona.");
      } else if (newGame.isDraw()) {
        setStatus("Remis! Gra zakończona.");
      } else {
        setStatus(""); // Reset statusu jeśli gra trwa dalej
      }
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // zawsze promujemy na hetmana
    };
    makeMove(move);
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setStatus(""); // Resetowanie statusu gry
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
      <div className="w-[400px]">
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      {status && <p className="mt-4 text-red-500">{status}</p>}
      <button className="mt-4" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default GameBoard;
