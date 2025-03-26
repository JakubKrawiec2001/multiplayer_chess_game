import StarIconSvg from "../components/StarIconSvg";
import HomeGamePanel from "../components/HomeGamePanel";
import { useGameStore } from "../stores/GameStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const gameId = useGameStore((state) => state.gameId);

  useEffect(() => {
    if (gameId) {
      navigate(`/game/${gameId}`);
    }
  }, [gameId, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gradient-bg grid-bg overflow-hidden">
      <StarIconSvg customClass="top-12 left-56 w-[100px] custom-shadow z-10" />
      <StarIconSvg customClass="bottom-12 right-56 w-[80px] custom-shadow z-10" />
      <StarIconSvg customClass="bottom-12 right-56 w-[80px] custom-shadow z-10" />
      <p className="absolute top-10 right-10  outlined-text text-white text-2xl font-black">
        Chess.io
      </p>
      <HomeGamePanel />
    </div>
  );
}

export default Home;
