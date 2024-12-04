import { PostgresSQLBuilder, ISQLBuilder } from "@/db/SqlBuilder";
import { PoolConfig } from 'pg';
import { IDatabaseConnection, PostgresConnection } from "./Connection";

export interface IAbstractDatabaseFactory {
    createConnection(config: any): IDatabaseConnection;
    createSQLBuilder(): ISQLBuilder;
}


export class PostgresFactory implements IAbstractDatabaseFactory {
    createConnection(config: PoolConfig): IDatabaseConnection {
        return new PostgresConnection(config);
    }

    createSQLBuilder(): ISQLBuilder {
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
