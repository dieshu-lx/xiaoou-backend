import logger from 'src/utils/logger';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import ChatService from './chat.service';

// 配置常量
const CONFIG = {
  TOKEN:
    'hf_jwt_eyJhbGciOiJFZERTQSJ9.eyJyZWFkIjp0cnVlLCJwZXJtaXNzaW9ucyI6eyJpbmZlcmVuY2Uuc2VydmVybGVzcy53cml0ZSI6dHJ1ZX0sIm9uQmVoYWxmT2YiOnsia2luZCI6InVzZXIiLCJfaWQiOiI2NzI5YmNiOWMzOTZiNGM5OWQwYThiNWMiLCJ1c2VyIjoiemlkb25ncmVuamkifSwiaWF0IjoxNzMzNDcwNDk3LCJzdWIiOiIvYmxhY2stZm9yZXN0LWxhYnMvRkxVWC4xLWRldiIsImV4cCI6MTczMzQ3NDA5NywiaXNzIjoiaHR0cHM6Ly9odWdnaW5nZmFjZS5jbyJ9.K02BMxgSPBh1OVFZdSjhfWLKCgxBx-SqK2TBa0w-5ENXrJvS138HqOlIkeGUrZ2MzWDuzGjfvAdXLloay6ICCw',
  MODELS: [
    'stabilityai/stable-diffusion-3.5-large-turbo',
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-3.5-large',
    'black-forest-labs/FLUX.1-dev',
  ],
  API_BASE_URL: 'https://api-inference.huggingface.co/models',
  PUBLIC_PATH: './public',
};

export default class TextToImageService {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  private async translateQuery(query: string): Promise<string> {
    const prompt = `将以下内容翻译成英文：${query} 只需要返回翻译后的内容，不要返回其他内容`;
    const translatedQuery = await this.chatService.createCompletion(prompt);
    logger.info(`翻译后的输入：${translatedQuery}`);
    return translatedQuery || '';
  }

  private async requestModel(
    model: string,
    data: any,
    token: string,
  ): Promise<Response> {
    const response = await fetch(`${CONFIG.API_BASE_URL}/${model}`, {
      headers: {
        Authorization: `Bearer ${token || CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      logger.info(`模型 ${model} 请求成功`);
      return response;
    }

    logger.error(`模型 ${model} 请求失败：${response.statusText}`);
    throw new Error(response.statusText);
  }

  private async saveImage(response: Response): Promise<string> {
    // 确保 public 文件夹存在
    if (!fs.existsSync(CONFIG.PUBLIC_PATH)) {
      fs.mkdirSync(CONFIG.PUBLIC_PATH, { recursive: true });
      logger.info(`创建目录：${CONFIG.PUBLIC_PATH}`);
    }

    const filename = randomUUID();
    const filepath = `${CONFIG.PUBLIC_PATH}/${filename}.png`;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);

    logger.info(`图片生成成功，保存为：${filepath}`);
    return filename;
  }

  async createImage(query: string, token: string) {
    logger.info(`图片生成 API 请求数据：${query}`);
    logger.info(`当前token：${token || CONFIG.TOKEN}`);

    const translatedQuery = await this.translateQuery(query);
    const data = { inputs: translatedQuery };

    let response: Response | undefined = undefined;

    // 尝试所有模型直到成功
    for (const model of CONFIG.MODELS) {
      try {
        response = await this.requestModel(model, data, token);
        break;
      } catch (error) {
        logger.error(`模型 ${model} 请求异常：${error.message}`);
        continue;
      }
    }

    if (!response) {
      throw new Error('所有模型请求均失败');
    }

    const filename = await this.saveImage(response);

    return {
      url: `http://localhost:3000/${filename}.png`,
    };
  }
}
