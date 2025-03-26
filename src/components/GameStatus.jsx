import React from "react";

const GameStatus = ({ gameStatus }) => {
  return (
    <div className="fixed w-full h-full bg-black/50 text-white text-5xl font-black z-[999]">
      {gameStatus}
    </div>
  );
};

export default GameStatus;
