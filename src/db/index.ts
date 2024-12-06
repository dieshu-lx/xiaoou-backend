import dbOperateInstance from 'src/utils/db.operate';

class NestTestTable<T extends object> {
  private tableName: string;
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async createTable() {
    await dbOperateInstance.connect();
    // 判断表是否存在
    const tableExists = await dbOperateInstance.checkTableExists(
      this.tableName,
    );
    if (tableExists) {
      return;
    }
    const sql = `CREATE TABLE ${this.tableName} (
      id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
      name VARCHAR(255),
      age int
    ) COMMENT '';`;
    await dbOperateInstance.createTable(sql, this.tableName);
  }

  async insertData(data: T) {
    await dbOperateInstance.insert(this.tableName, data);
  }

  async selectData(params?: any): Promise<T[]> {
    const result = await dbOperateInstance.find(this.tableName, params);
    return result as T[];
  }

  async updateData(data: T, condition: string, conditionParams: any[]) {
    await dbOperateInstance.update(
      this.tableName,
      data,
      condition,
      conditionParams,
    );
  }

  async deleteData(condition: string, conditionParams: any[]) {
    await dbOperateInstance.delete(this.tableName, condition, conditionParams);
  }
}

const nestTestTableInstance = new NestTestTable('nest_test_table');

export { nestTestTableInstance };
