import supabase from "../supabase/supabase";
import { useState } from "react";

export default function useCloseCurrentGame() {
  const [isLoading, setIsLoading] = useState(false);

  const closeCurrentGame = async (id) => {
    setIsLoading(true);
    try {
      await supabase
        .from("game")
        .update({
          finished: true,
        })
        .eq("game_id", id);
    } catch (error) {
      console.error("Game error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { closeCurrentGame, isLoading };
}
