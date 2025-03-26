import React, { useEffect, useMemo, useState } from "react";
import supabase from "../supabase/supabase";
import Loading from "./Loading";

const MovesPanel = ({ id }) => {
  const [moves, setMoves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMoves = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from("game")
          .select("moves")
          .eq("game_id", id)
          .single()
          .order("moves", { ascending: true });

        if (data) {
          setMoves(data.moves);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoves();

    const channel = supabase
      .channel("game")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game",
          filter: `game_id=eq.${id}`,
        },
        (payload) => {
          setMoves(payload.new.moves || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const chunkedMoves = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < moves.length; i += 2) {
      chunks.push([moves[i], moves[i + 1]]);
    }
    return chunks;
  }, [moves]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <h2 className="text-2xl mb-2 text-white font-black outlined-text">
        Moving board
      </h2>
      <div className="bg-black/20 backdrop-blur-[2px] p-6 shadow-md rounded-2xl min-h-[500px] max-h-[500px] overflow-auto flex flex-col flex-wrap gap-2 gap-x-12 custom-scroll">
        {moves.length === 0 ? (
          <p className="text-slate-300 font-bold z-10">
            Make your first move...
          </p>
        ) : (
          chunkedMoves.map((turn, index) => (
            <div key={index} className="flex gap-2 text-white">
              <span className="font-black">{index + 1}.</span>
              <p>{turn[0]}</p>
              <p>{turn[1] ?? ""}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MovesPanel;
