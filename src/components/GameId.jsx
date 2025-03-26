import React, { useState } from "react";
import { FaRegCopy, FaCopy } from "react-icons/fa6";
import { toast } from "react-toastify";

const GameId = ({ gameId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameId);
      toast("GameID copie ✅");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div
      onClick={copyToClipboard}
      className="relative cursor-pointer flex items-center gap-2 bg-black/20 backdrop-blur-[2px] p-3 shadow-md rounded-2xl mt-4 text-white"
    >
      <div className="">
        <p className="font-black">Game ID</p>
        <span className="line-clamp-1">{gameId}</span>
      </div>
      <div className="absolute right-4 top-4">
        {copied ? <FaCopy /> : <FaRegCopy />}
      </div>
    </div>
  );
};

export default GameId;
