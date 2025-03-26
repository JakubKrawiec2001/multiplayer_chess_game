import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      username: "",

      setUsername: (name) => {
        const userId = uuidv4();
        set({ username: name, userId });
      },

      logout: () => set({ userId: null, username: "" }),
    }),
    {
      name: "chess-user-session",
      getStorage: () => localStorage,
    }
  )
);
