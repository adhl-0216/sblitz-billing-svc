import { Pool, PoolConfig, PoolClient, QueryResult } from 'pg';

export interface DatabaseConnection {
    query(sql: string, params?: any[]): Promise<QueryResult>;
    close(): Promise<void>;
}


export class PostgresConnection implements DatabaseConnection {
    private pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
    }

    query(sql: string, params?: any[]): Promise<QueryResult> {
        return this.pool.query(sql, params);
    }

    connect(): Promise<PoolClient> {
        return this.pool.connect();
    }

    close(): Promise<void> {
        return this.pool.end();
    }
}