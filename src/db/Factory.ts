import { PostgresSQLBuilder, SQLBuilder } from "@/db/SqlBuilder";
import { PoolConfig } from 'pg';
import { DatabaseConnection, PostgresConnection } from "./Connection";

export interface AbstractDatabaseFactory {
    createConnection(config: any): DatabaseConnection;
    createSQLBuilder(): SQLBuilder;
}


class PostgresFactory implements AbstractDatabaseFactory {
    createConnection(config: PoolConfig): DatabaseConnection {
        return new PostgresConnection(config);
    }

    createSQLBuilder(): SQLBuilder {
        return new PostgresSQLBuilder();
    }
}

// TODO: for migration 
// class OracleFactory implements AbstractDatabaseFactory {
//     createConnection(config: oracledb.ConnectionAttributes): DatabaseConnection {
//         return new OracleConnection(config);
//     }

//     createSQLBuilder(): SQLBuilder {
//         return new OracleSQLBuilder();
//     }
// }

export function createDatabaseFactory(type: 'postgres' | 'oracle'): AbstractDatabaseFactory {
    switch (type) {
        case 'postgres':
            return new PostgresFactory();
        case 'oracle':
            throw new Error('Not implemented');
        default:
            throw new Error('Unsupported database type');
    }
}
