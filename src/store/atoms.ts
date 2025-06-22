import { atom } from "jotai";
import {
  type GameOverInterface,
  type gamestateinterface,
  type MyRoom,
  type Room,
} from "../types";
import { atomWithStorage } from "jotai/utils";

export const gameFormAtom = atom<boolean>(false);
export const roomsAtom = atom<Room[]>([]);

export const nameAtom = atomWithStorage<string>("name", "", {
  getItem: (key) => {
    const item = sessionStorage.getItem(key);
    return item !== null ? JSON.parse(item) : "";
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  },
});
export const profileAtom = atomWithStorage<string>("profile", "", {
  getItem: (key) => {
    const item = sessionStorage.getItem(key);
    return item !== null ? JSON.parse(item) : "";
  },
  setItem: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  },
});
export const joinConfirmAtom = atom<string | boolean>(false);
export const joiningAtom = atom<boolean>(false);

export const gamestateAtom = atom<gamestateinterface | null>(null);
export const myRoomAtom = atom<MyRoom | null>(null);
export const gameoverAtom = atom<GameOverInterface>({
  winner: null,
  result: null,
});

export const changeColorAtom = atom<boolean>(false);
