import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import supabase from "../supabase/supabase";
import { useGameStore } from "../stores/GameStore";
import { useUserStore } from "../stores/UserStore";
import Loading from "../components/Loading";
import logo from "../assets/logo.svg";
import { toast } from "react-toastify";

const HomeGamePanel = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [joinGameId, setJoinGameId] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const setGameId = useGameStore((state) => state.setGameId);
  const setWhitePlayer = useGameStore((state) => state.setWhitePlayer);
  const setBlackPlayer = useGameStore((state) => state.setBlackPlayer);
  const setUsername = useUserStore((state) => state.setUsername);
  const joinInputRef = useRef(null);

  const handleCreateGame = async () => {
    setLoading(true);

    if (!name) {
      toast("Enter your nickname");
      setLoading(false);
      return;
    }
    if (name.length < 4 || name.length > 10) {
      toast("Nickname must be between 4 and 10 characters long!");
      setLoading(false);
      return;
    }

    try {
      const gameId = uuidv4();

      const { data, error } = await supabase
        .from("game")
        .insert([
          {
            game_id: gameId,
            white_player: name,
            black_player: "",
            moves: [],
          },
        ])
        .select();

      if (error) {
        toast("Error creating game");
        return;
      }
      if (data) {
        setBlackPlayer("");
        setWhitePlayer(name);
        setUsername(name);
        setGameId(gameId);
        navigate(`/game/${gameId}`);
      }
    } catch (error) {
      console.log("Error creating game:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    setLoading(true);

    if (!name) {
      toast("Enter your nickname");
      setLoading(false);
      return;
    }
    if (!joinGameId) {
      toast("Enter GameID");
      setLoading(false);
      return;
    }
    if (name.length < 4 || name.length > 10) {
      toast("Nickname must be between 4 and 10 characters long!");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .eq("game_id", joinGameId)
        .single();

      if (error || !data) {
        toast("Game with this ID does not exist");
        return;
      }

      if (data.black_player && data.white_player) {
        toast("Game is already full");
        return;
      }

      if (data || !data.black_player) {
        const { error: updateError } = await supabase
          .from("game")
          .update({ black_player: name })
          .eq("game_id", joinGameId);

        if (updateError) {
          toast("Error joining game");
          return;
        }

        setBlackPlayer(name);
        setWhitePlayer(data.white_player);
        setUsername(name);
        setGameId(joinGameId);
      }
      navigate(`/game/${joinGameId}`);
    } catch (err) {
      console.log("Error joining game:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showJoinInput &&
        joinInputRef.current &&
        !joinInputRef.current.contains(event.target)
      ) {
        setShowJoinInput(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showJoinInput]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 md:gap-4 z-10">
        <img src={logo} alt="" className="w-[40px] md:w-[60px] custom-shadow" />
        <h1 className="text-3xl md:text-5xl mb-4 text-center text-white font-black outlined-text leading-7 md:leading-12 tracking-wide">
          LET'S PLAY <span className="block">CHESS ONLINE</span>
        </h1>
      </div>
      <div className="bg-black/20 backdrop-blur-[2px] p-5 md:p-10 shadow-md z-10 rounded-2xl mt-2">
        <input
          type="text"
          placeholder="Nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={10}
          min={4}
          className="text-lg md:text-2xl w-full bg-white/30 border-[2px] border-white p-2 rounded-lg font-bold placeholder-white outline-none caret-main-burgundy text-white"
        />
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6">
          <button onClick={handleCreateGame} className="main-white-btn">
            Create Game
          </button>
          <button
            onClick={() => setShowJoinInput(!showJoinInput)}
            className="main-dark-btn"
          >
            Join Game
          </button>
        </div>
      </div>
      <div
        ref={joinInputRef}
        className={`flex flex-col items-center gap-4 absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/50 backdrop-blur-[5px] p-10 shadow-md z-10 rounded-2xl border-[2px] border-white transition-all ${
          showJoinInput
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <input
          type="text"
          placeholder="Game ID"
          value={joinGameId}
          onChange={(e) => setJoinGameId(e.target.value)}
          className="text-2xl text-white bg-white/30 border-[2px] border-white p-2 rounded-lg font-bold placeholder-white outline-none caret-main-burgundy"
        />
        <button
          onClick={handleJoinGame}
          className="bg-main-dark-blue text-white text-2xl font-black uppercase px-3 py-3 rounded-lg light-btn-shadow cursor-pointer hover:bg-blue-950 transition-colors"
        >
          Dołącz do gry
        </button>
      </div>
    </>
  );
};

export default HomeGamePanel;
