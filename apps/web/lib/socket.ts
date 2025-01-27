import { io } from 'socket.io-client';

const URL = 'http://localhost:4000';

const socketOptions = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

export const socket = io(URL, {
  ...socketOptions,

  auth: {
    username: localStorage.getItem('player:nickname'),
    token: localStorage.getItem('player:token'),
  },
});
