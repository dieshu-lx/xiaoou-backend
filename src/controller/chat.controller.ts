import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from 'src/service';

interface IChatParams {
  question: string;
}
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('')
  async chat(
    @Body() { question }: IChatParams,
    @Res() res: Response,
  ): Promise<void> {
    // 设置 SSE 头部
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.chatService.createStreamCompletion(question, res);
  }
}
