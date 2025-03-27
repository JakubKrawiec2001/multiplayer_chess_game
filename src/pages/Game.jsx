import { useParams } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import MovesPanel from "../components/MovesPanel";
import GameId from "../components/GameId";

function Game() {
  const { id } = useParams();

  return (
    <div className="gradient-bg grid-bg">
      <div className="max-w-[1250px] mx-auto flex flex-col justify-center gap-12 px-2 lg:px-4 min-h-screen">
        <h1 className="outlined-text text-white text-3xl md:text-5xl font-black text-center mt-4 md:mt-0">
          Chess.io
        </h1>
        <div className="flex flex-col md:flex-row gap-6 md:border-4 md:border-black/20 rounded-2xl md:p-4 lg:p-6">
          <GameBoard id={id} />
          <div className="md:w-[40%]">
            <MovesPanel id={id} />
            <GameId gameId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
