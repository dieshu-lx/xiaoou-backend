import { Body, Controller, Post } from '@nestjs/common';
import SocketService from 'src/service/socket.service';

@Controller('socket')
export default class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Post('send-message')
  sendMessage(@Body() body: { message: string }) {
    this.socketService.sendMessage(body.message);
  }
}
