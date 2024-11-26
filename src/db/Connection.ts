import { Pool, PoolConfig, QueryResult } from 'pg';

export type ConnectionConfig = PoolConfig

export interface DatabaseConnection {
    query(sql: string, params?: any[]): Promise<any>;
    close(): Promise<void>;
    beginTransaction(): Promise<DatabaseTransaction>;
}

export interface DatabaseTransaction {
    query(sql: string, params?: any[]): Promise<any>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

export class PostgresConnection implements DatabaseConnection {

    private pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config as PoolConfig);
    }

    query(sql: string, params?: any[]): Promise<QueryResult> {
        return this.pool.query(sql, params);
    }

    close(): Promise<void> {
        return this.pool.end();
    }

    async beginTransaction(): Promise<DatabaseTransaction> {
        const client = await this.pool.connect();
        await client.query('BEGIN');

        return {
            query: (sql: string, params?: any[]): Promise<QueryResult> => {
                return client.query(sql, params);
            },
            commit: async (): Promise<void> => {
                await client.query('COMMIT');
                client.release();
            },
            rollback: async (): Promise<void> => {
                await client.query('ROLLBACK');
                client.release();
            }
        };
    }
}

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
