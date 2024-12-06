import { Body, Controller, Post } from '@nestjs/common';
import { IResponse } from 'src/models';
import TextToImageService from 'src/service/text-to-image.service';

interface IChatResponse {
  id: string;
  content: string;
  role: string;
  type: 'text' | 'image';
}

@Controller('text-to-image')
export default class TextToImageController {
  constructor(private readonly textToImageService: TextToImageService) {}

  @Post('')
  async createImage(
    @Body() { question, token }: { question: string; token: string },
  ): Promise<IResponse<IChatResponse>> {
    const result = await this.textToImageService.createImage(question, token);
    return {
      data: {
        id: Math.random().toString(36).substring(2, 15),
        content: result.url,
        role: 'assistant',
        type: 'image',
      },
      message: 'success',
      code: 200,
    };
  }
}
