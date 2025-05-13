import { Injectable } from '@nestjs/common';
import { ChatGateway } from 'src/controller/socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly chatGateway: ChatGateway) {}

  sendMessage(message: string) {
    this.chatGateway.sendMessageToAll(message);
  }
}
