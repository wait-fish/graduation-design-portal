import io from 'socket.io-client';

export default class Socket {
  static socket = null;

  static initSocket() {
    if (this.socket) return this.socket;
    return this.socket = io('ws://localhost:4000/');
  }
}