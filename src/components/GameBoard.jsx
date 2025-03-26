import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import supabase from "../supabase/supabase";
import { useUserStore } from "../stores/UserStore";
import { useGameStore } from "../stores/GameStore";
import { FaUser } from "react-icons/fa";
import GameStatus from "./GameStatus";

const GameBoard = ({ id }) => {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [gameData, setGameData] = useState(null);
  const username = useUserStore((state) => state.username);
  const logout = useUserStore((state) => state.logout);
  const currentGameStatus = useGameStore((state) => state.currentGameStatus);
  const setCurrentGameStatus = useGameStore(
    (state) => state.setCurrentGameStatus
  );
  const whitePlayer = useGameStore((state) => state.whitePlayer);
  const blackPlayer = useGameStore((state) => state.blackPlayer);
  const setWhitePlayer = useGameStore((state) => state.setWhitePlayer);
  const setBlackPlayer = useGameStore((state) => state.setBlackPlayer);
  const gameId = useGameStore((state) => state.gameId);
  const setGameId = useGameStore((state) => state.setGameId);
  const resetCurrentGame = useGameStore((state) => state.resetCurrentGame);

  const makeMove = async (move) => {
    if (game.isGameOver()) {
      handleIsGameOver();
      return;
    }
    try {
      const currentTurn = game.turn();

      if (currentTurn === "w" && username !== whitePlayer) {
        console.log("❌ Nie jest twoja kolej czarny");
        return null;
      } else if (currentTurn === "b" && username !== blackPlayer) {
        console.log("❌ Nie jest twoja kolej biały");
        return null;
      }
      const result = game.move(move);
      if (!result) {
        return null;
      }

      setFen(game.fen());

      const newMoves = [...(gameData?.moves || []), result.san];

      const { error } = await supabase
        .from("game")
        .update({ moves: newMoves })
        .eq("game_id", id);

      if (error) {
        console.error("Błąd przy aktualizacji ruchów:", error);
      }

      return result;
    } catch (error) {
      console.log("Błędny ruch z funkcji makeMove:", error);
      return null;
    }
  };
  const onDrop = async (sourceSquare, targetSquare) => {
    setSelectedSquare(null);
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    const move = await makeMove(moveData);
    if (!move) {
      console.log("Nieprawidłowy ruch (drag-and-drop)");
    }
    return true;
  };

  const handleSquareClick = async (square) => {
    if (!selectedSquare) {
      setSelectedSquare(square);
      return;
    }

    const moveData = {
      from: selectedSquare,
      to: square,
      promotion: "q",
    };
    const move = await makeMove(moveData);

    setSelectedSquare(null);

    if (!move) {
      console.log("Nieprawidłowy ruch (click-to-move)");
    }
  };

  const handlePieceDragBegin = (_piece, sourceSquare) => {
    setSelectedSquare(sourceSquare);
  };

  const resetGame = async () => {
    game.reset();
    setFen(game.fen());
    setCurrentGameStatus("start");
    setSelectedSquare(null);

    const { error } = await supabase
      .from("game")
      .update({ moves: [] })
      .eq("game_id", id);

    if (error) {
      console.log("Błąd przy resetowaniu gry w bazie:", error);
    }
  };

  const handleIsGameOver = () => {
    const isGameOver = game.isGameOver();
    if (isGameOver) {
      resetCurrentGame();
      logout();
      if (game.isCheckmate()) {
        setCurrentGameStatus(
          `Checkmate! ${game.turn() === "w" ? "black" : "white"} wins!`
        );
      } else if (game.isDraw()) {
        setCurrentGameStatus("Draw");
      } else {
        setCurrentGameStatus("Game over");
      }
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .eq("game_id", id)
        .single();

      if (error) {
        console.log("Błąd przy pobieraniu gry:", error);
      } else {
        setGameData(data);

        if (data.moves && data.moves.length > 0) {
          game.reset();
          data.moves.forEach((sanMove) => {
            game.move(sanMove);
          });
          setFen(game.fen());
        }
      }
    };

    fetchGame();
  }, [id, game]);

  useEffect(() => {
    const channel = supabase
      .channel("game-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game",
          filter: `game_id=eq.${id}`,
        },
        (payload) => {
          const updatedGame = payload.new;
          setGameData(updatedGame);

          setGameId(updatedGame.game_id);
          if (!whitePlayer && updatedGame.white_player) {
            setWhitePlayer(updatedGame.white_player);
          }

          if (!blackPlayer && updatedGame.black_player) {
            setBlackPlayer(updatedGame.black_player);
          }

          game.reset();
          if (updatedGame.moves && updatedGame.moves.length > 0) {
            updatedGame.moves.forEach((sanMove) => {
              game.move(sanMove);
            });
          }
          setFen(game.fen());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    id,
    game,
    whitePlayer,
    blackPlayer,
    setWhitePlayer,
    setBlackPlayer,
    setGameId,
  ]);

  const customSquareStyles = selectedSquare
    ? {
        [selectedSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)",
        },
      }
    : {};

  const playerOrientation =
    username === whitePlayer ? whitePlayer : blackPlayer;
  return (
    <div className="flex flex-col items-center justify-center w-[60%]">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <FaUser
            className={`p-1 text-3xl rounded-md ${
              playerOrientation === blackPlayer
                ? "bg-white text-main-burgundy"
                : "bg-main-dark-blue text-white"
            }`}
          />
          <p className="text-xl text-white font-medium">
            {playerOrientation === whitePlayer ? blackPlayer : whitePlayer}
          </p>
        </div>
        <Chessboard
          position={fen}
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDragEnd={() => setSelectedSquare(null)}
          onSquareClick={handleSquareClick}
          onPieceDrop={onDrop}
          customSquareStyles={customSquareStyles}
          boardOrientation={username === whitePlayer ? "white" : "black"}
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <FaUser
              className={`p-1 text-3xl rounded-md ${
                playerOrientation === whitePlayer
                  ? "bg-white text-main-burgundy"
                  : "bg-main-dark-blue text-white"
              }`}
            />
            <p className="text-xl text-white font-medium">
              {playerOrientation}
            </p>
          </div>
          <button
            className="bg-white text-main-dark-blue text-base font-black uppercase p-2 rounded-lg dark-btn-shadow cursor-pointer hover:bg-slate-200 transition-colors z-10"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </div>
      </div>
      {gameId === null && currentGameStatus !== "start" && (
        <GameStatus gameStatus={currentGameStatus} />
      )}
    </div>
  );
};

export default GameBoard;
