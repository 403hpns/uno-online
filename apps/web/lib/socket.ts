import { io } from 'socket.io-client';

const URL = 'http://localhost:4000';

const socketOptions = {
  autoConnect: false,
  reconnection: true,
};

export const socket = io(URL, {
  ...socketOptions,
});
