import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
  persist(
    (set) => ({
      gameId: null,
      whitePlayer: "",
      blackPlayer: "",
      setGameId: (gameId) => set({ gameId }),
      setWhitePlayer: (player) => set({ whitePlayer: player }),
      setBlackPlayer: (player) => set({ blackPlayer: player }),

      resetCurrentGame: () =>
        set({
          gameId: null,
          whitePlayer: "",
          blackPlayer: "",
        }),
    }),
    {
      name: "game-storage",
      getStorage: () => localStorage,
    }
  )
);
