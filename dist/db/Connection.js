"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConnection = void 0;
const pg_1 = require("pg");
class PostgresConnection {
    pool;
    constructor(config) {
        this.pool = new pg_1.Pool(config);
    }
    query(sql, params) {
        return this.pool.query(sql, params);
    }
    close() {
        return this.pool.end();
    }
    async beginTransaction() {
        const client = await this.pool.connect();
        await client.query('BEGIN');
        return {
            query: (sql, params) => {
                return client.query(sql, params);
            },
            commit: async () => {
                await client.query('COMMIT');
                client.release();
            },
            rollback: async () => {
                await client.query('ROLLBACK');
                client.release();
            }
        };
    }
}
exports.PostgresConnection = PostgresConnection;
// export class OracleConnection implements DatabaseConnection {
//     private connection: Connection;
//     constructor(config: oracledb.ConnectionAttributes) {
//         oracledb.initOracleClient();
//     }
//     async connect(config: oracledb.ConnectionAttributes): Promise<void> {
//         this.connection = await oracledb.getConnection(config);
//     }
//     async query(sql: string, params: any[] = []): Promise<any> {
//         const options: ExecuteOptions = {
//             outFormat: oracledb.OUT_FORMAT_OBJECT
//         };
//         const result: Result<any> = await this.connection.execute(sql, params, options);
//         return result;
//     }
//     async close(): Promise<void> {
//         if (this.connection) {
//             await this.connection.close();
//         }
//     }
//     async beginTransaction(): Promise<DatabaseTransaction> {
//         await this.connection.execute('BEGIN');
//         return {
//             query: async (sql: string, params: any[] = []): Promise<any> => {
//                 const options: ExecuteOptions = {
//                     outFormat: oracledb.OUT_FORMAT_OBJECT
//                 };
//                 const result: Result<any> = await this.connection.execute(sql, params, options);
//                 return result;
//             },
//             commit: async (): Promise<void> => {
//                 await this.connection.commit();
//             },
//             rollback: async (): Promise<void> => {
//                 await this.connection.rollback();
//             }
//         };
//     }
// }
//# sourceMappingURL=Connection.js.map