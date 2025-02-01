import { Manager } from 'socket.io-client';

const manager = new Manager({
  autoConnect: false,
  transports: ['websocket'],
});

export const socket = manager.socket('/');
