import { Socket } from 'socket.io';

class WsMap {
  private map = new Map<string, Socket>();
  set(key: string, value: Socket) {
    this.map.set(key, value);
  }

  get(key: string) {
    return this.map.get(key);
  }

  delete(key: string) {
    this.map.delete(key);
  }
}

export const wsMap = new WsMap();
