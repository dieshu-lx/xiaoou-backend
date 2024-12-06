import { Controller, Post, Body, Res } from '@nestjs/common';
import ChatService from 'src/service/chat.service';
import { Response } from 'express';

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
