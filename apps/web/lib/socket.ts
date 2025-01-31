import { Manager } from 'socket.io-client';

const manager = new Manager({
  port: 4000,
  autoConnect: false,
});

export const socket = manager.socket('/');
