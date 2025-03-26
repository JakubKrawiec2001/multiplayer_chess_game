import { useParams } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import MovesPanel from "../components/MovesPanel";
import GameId from "../components/GameId";

function Game() {
  const { id } = useParams();

  return (
    <div className="gradient-bg grid-bg">
      <div className="max-w-[1250px] mx-auto flex flex-col justify-center gap-12 px-2 lg:px-4 min-h-screen">
        <h1 className="outlined-text text-white text-5xl font-black text-center">
          Chess.io
        </h1>
        <div className="flex gap-6 border-4 border-black/20 rounded-2xl p-6">
          <GameBoard id={id} />
          <div className="w-[40%]">
            <MovesPanel id={id} />
            <GameId gameId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
