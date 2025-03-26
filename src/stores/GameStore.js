import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
  persist(
    (set) => ({
      gameId: null,
      whitePlayer: "",
      blackPlayer: "",
      currentGameStatus: "start",
      setGameId: (gameId) => set({ gameId }),
      setWhitePlayer: (player) => set({ whitePlayer: player }),
      setBlackPlayer: (player) => set({ blackPlayer: player }),
      setCurrentGameStatus: (status) => set({ currentGameStatus: status }),

      resetCurrentGame: () =>
        set({
          gameId: null,
          whitePlayer: "",
          blackPlayer: "",
          currentGameStatus: "",
        }),
    }),
    {
      name: "game-storage",
      getStorage: () => localStorage,
    }
  )
);
