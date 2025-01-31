import { Manager } from 'socket.io-client';

const manager = new Manager('wss://403hpns.dev', {
  autoConnect: false,
  transports: ['websocket'],
});

export const socket = manager.socket('/');
