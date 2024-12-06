import {
  Connection,
  createConnection,
  ConnectionOptions,
} from 'mysql2/promise';
import logger from './logger';

class DbOperate {
  private connection: Connection | null = null;

  constructor(private connectionConfig: ConnectionOptions) {}

  async connect() {
    try {
      this.connection = await createConnection(this.connectionConfig);
      logger.info('数据库连接成功');
    } catch (error) {
      logger.error('数据库连接失败', { error: error.message });
      throw new Error(`数据库连接失败，请检查配置: ${error.message}`);
    }
  }

  async createTable(sql: string, tableName: string) {
    await this.query(sql);
    logger.info(`创建表成功: ${tableName}`);
  }

  async query(sql: string, params?: any[]) {
    if (!this.connection) {
      logger.error('未连接到数据库');
      throw new Error('未连接到数据库');
    }
    try {
      const [rows] = await this.connection.execute(sql, params);
      logger.info(`查询成功: ${sql} ${params} ${JSON.stringify(rows)}`);
      return rows;
    } catch (error) {
      logger.error(`查询失败: ${sql} ${params}`, { error });
      throw new Error('查询失败，请检查SQL语句');
    }
  }

  async insert(table: string, data: Record<string, any>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    logger.info(`执行插入操作: ${table} ${data}`);
    return this.query(sql, values);
  }

  async update(
    table: string,
    data: Record<string, any>,
    condition: string,
    conditionParams?: any[],
  ) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
    logger.info(`执行更新操作: ${table} ${data} ${condition}`);
    return this.query(sql, [...values, ...(conditionParams || [])]);
  }

  async delete(table: string, condition: string, conditionParams?: any[]) {
    const sql = `DELETE FROM ${table} WHERE ${condition}`;
    logger.info(`执行删除操作: ${table} ${condition}`);
    return this.query(sql, conditionParams);
  }

  async find(table: string, condition?: string, conditionParams?: any[]) {
    let sql = `SELECT * FROM ${table}`;
    if (condition) {
      sql += ` WHERE ${condition}`;
    }
    logger.info(`执行查找操作: ${table} ${condition}`);
    return this.query(sql, conditionParams);
  }

  async close() {
    if (this.connection) {
      try {
        await this.connection.end();
        logger.info('数据库连接已关闭');
      } catch (error) {
        logger.error(`关闭连接失败: ${error}`);
      }
    }
  }

  async checkTableExists(table: string) {
    const sql = `SHOW TABLES LIKE '${table}'`;
    const result = await this.query(sql);
    const tableExists = Array.isArray(result) && result.length > 0;
    logger.info(`检查表是否存在: ${table} ${tableExists ? '是' : '否'}`);
    return tableExists;
  }
}

const dbOperateInstance = new DbOperate({
  host: '127.0.0.1',
  user: 'root',
  password: '12345678',
  database: 'my_database',
});

export default dbOperateInstance;
