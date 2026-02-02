import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const setSocket = (value: Socket | null) => {
  socket = value;
};

export const getSocket = () => socket;
