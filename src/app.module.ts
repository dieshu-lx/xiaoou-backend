import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController, ChatController, ChatGateway, SocketController, TextToImageController } from './controller';
import { AppService, ChatService, SocketService, TextToImageService } from './service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
  ],
  controllers: [
    AppController,
    ChatController,
    SocketController,
    TextToImageController,
    ChatGateway,
  ],
  providers: [
    AppService,
    ChatService,
    SocketService,
    TextToImageService,
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
