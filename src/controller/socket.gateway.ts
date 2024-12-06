// 导入所需的WebSocket相关装饰器和类型
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import logger from 'src/utils/logger';

/**
 * WebSocket网关类,用于处理实时消息通信
 * @namespace chat - WebSocket命名空间
 */
@WebSocketGateway({
  namespace: '/socket',
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // WebSocket服务器实例
  @WebSocketServer()
  server: Server;

  /**
   * WebSocket服务初始化完成时的回调
   * @param server - WebSocket服务器实例
   */
  afterInit(server: Server) {
    logger.info('WebSocket 初始化完成', server);
  }

  /**
   * 处理客户端连接事件
   * @param client - 连接的客户端Socket实例
   */
  handleConnection(client: Socket) {
    logger.info('WebSocket 连接成功', client);
  }

  /**
   * 处理客户端断开连接事件
   * @param client - 断开连接的客户端Socket实例
   */
  handleDisconnect(client: Socket) {
    logger.info('WebSocket 连接断开', client);
  }

  /**
   * 处理接收到的消息
   * @param client - 发送消息的客户端Socket实例
   * @param message - 接收到的消息内容
   */
  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    logger.info(`收到消息: ${message}`);
    this.sendMessage(client, message);
  }

  /**
   * 向客户端发送消息
   * @param client - 目标客户端Socket实例
   * @param message - 要发送的消息内容
   */
  sendMessage(client: Socket, message: string) {
    logger.info(`发送消息: ${message}`);
    client.emit('message', message);
  }

  /**
   * 向所有客户端发送消息
   * @param message - 要发送的消息内容
   */
  sendMessageToAll(message: string) {
    this.server.emit('message', message);
  }
}
