import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
// import { nestTestTableInstance, nestCatsTableInstance } from './db';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ChatController } from './controller/chat.controller';
import ChatService from './service/chat.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import TextToImageService from './service/text-to-image.service';
import TextToImageController from './controller/text-to-image.controller';
import { ChatGateway } from './controller/socket.gateway';
import SocketController from './controller/socket.controller';
import SocketService from './service/socket.service';

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
  ],
  providers: [
    AppService,
    ChatService,
    SocketService,
    TextToImageService,
    ChatGateway,
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
