import OpenAI from 'openai';
import logger from 'src/utils/logger';
import { Response } from 'express';

// 配置常量
const CONFIG = {
  API_KEY: process.env.BAILIAN_API_KEY || 'sk-56a5d3d32fe44816ab0ba61b8ca6d987',
  BASE_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  MODEL: 'qwen-plus',
};

const openai = new OpenAI({
  apiKey: CONFIG.API_KEY,
  baseURL: CONFIG.BASE_URL,
});

// 添加类型定义
interface ChatResponse {
  content: string;
}

interface ChatErrorResponse {
  error: string;
}

export default class ChatService {
  /**
   * 创建AI对话完成（普通返回）
   * @param question 用户问题
   * @param res Express Response 对象
   */
  async createCompletion(question: string): Promise<string> {
    try {
      logger.info(`调用百炼API，问题：${question}`);

      const completion = await openai.chat.completions.create({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system' as const, content: 'You are a helpful assistant.' },
          { role: 'user' as const, content: question },
        ],
        stream: false,
      });

      const content = completion.choices[0]?.message?.content || '';
      logger.info(`百炼API返回内容：${content}`);
      return content;
    } catch (error) {
      logger.error(
        `百炼API调用失败：${error instanceof Error ? error.message : String(error)}`,
      );
      return '处理失败';
    }
  }

  /**
   * 创建AI对话完成（SSE流式返回）
   * @param question 用户问题
   * @param res Express Response 对象
   */
  async createStreamCompletion(question: string, res: Response): Promise<void> {
    try {
      logger.info(`调用百炼API流式接口，问题：${question}`);

      const completion = await openai.chat.completions.create({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system' as const, content: 'You are a helpful assistant.' },
          { role: 'user' as const, content: question },
        ],
        stream: true,
      });

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        logger.info(`百炼API返回内容：${content}`);
        if (content) {
          res.write(
            `data: ${JSON.stringify({ content } satisfies ChatResponse)}\n\n`,
          );
        }
      }
      logger.info('百炼API流式返回内容：[DONE]');
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      logger.error(
        `百炼API流式调用失败：${error instanceof Error ? error.message : String(error)}`,
      );
      res.write(
        `data: ${JSON.stringify({ error: '处理失败' } satisfies ChatErrorResponse)}\n\n`,
      );
      res.end();
    }
  }
}
