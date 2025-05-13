import { Body, Controller, Post } from '@nestjs/common';
import { SocketService } from 'src/service';

@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Post('send-message')
  sendMessage(@Body() body: { message: string }) {
    this.socketService.sendMessage(body.message);
  }
}
