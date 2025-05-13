import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import logger from "src/utils/logger";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
    logger.error(`时间: ${new Date().toISOString()} 请求路径: ${request.url} 方法: ${request.method}`, { error: exception.message });
  }
}