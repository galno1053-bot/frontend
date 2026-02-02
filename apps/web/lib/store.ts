import { create } from "zustand";
import type { ChatMessageDTO, LeaderboardRow, PresenceUpdate, RoundState } from "@galno/shared";

export interface UserState {
  id: string;
  username: string;
  evmAddress?: string | null;
  solAddress?: string | null;
}

interface AppState {
  token: string | null;
  user: UserState | null;
  balance: number;
  round: RoundState | null;
  multiplier: number;
  last100: number[];
  leaderboard: LeaderboardRow[];
  chat: ChatMessageDTO[];
  presence: PresenceUpdate | null;
  soundOn: boolean;
  ping: number;
  setToken: (token: string | null) => void;
  setUser: (user: UserState | null) => void;
  setBalance: (balance: number) => void;
  setRound: (round: RoundState | null) => void;
  setMultiplier: (multiplier: number) => void;
  setLast100: (values: number[]) => void;
  addLastMultiplier: (value: number) => void;
  setLeaderboard: (rows: LeaderboardRow[]) => void;
  addChat: (msg: ChatMessageDTO) => void;
  setChat: (msgs: ChatMessageDTO[]) => void;
  setPresence: (presence: PresenceUpdate) => void;
  toggleSound: () => void;
  setPing: (ping: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  balance: 0,
  round: null,
  multiplier: 1,
  last100: [],
  leaderboard: [],
  chat: [],
  presence: null,
  soundOn: true,
  ping: 0,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setBalance: (balance) => set({ balance }),
  setRound: (round) => set({ round }),
  setMultiplier: (multiplier) => set({ multiplier }),
  setLast100: (values) => set({ last100: values }),
  addLastMultiplier: (value) => set((state) => ({ last100: [value, ...state.last100].slice(0, 100) })),
  setLeaderboard: (rows) => set({ leaderboard: rows }),
  addChat: (msg) => set((state) => ({ chat: [...state.chat.slice(-199), msg] })),
  setChat: (msgs) => set({ chat: msgs }),
  setPresence: (presence) => set({ presence }),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setPing: (ping) => set({ ping })
}));
