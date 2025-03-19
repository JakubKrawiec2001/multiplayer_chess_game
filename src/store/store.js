import { create } from "zustand";
import { Chess } from "chess.js";

export const useChessStore = create((set) => ({
  game: new Chess(),
  setGame: (game) => set({ game }),
}));
