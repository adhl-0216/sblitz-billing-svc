"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresFactory = void 0;
const SqlBuilder_1 = require("@/db/SqlBuilder");
const Connection_1 = require("./Connection");
class PostgresFactory {
    createConnection(config) {
        return new Connection_1.PostgresConnection(config);
    }
    createSQLBuilder() {
        return new SqlBuilder_1.PostgresSQLBuilder();
    }
}
exports.PostgresFactory = PostgresFactory;
// TODO: for migration 
// class OracleFactory implements AbstractDatabaseFactory {
//     createConnection(config: oracledb.ConnectionAttributes): DatabaseConnection {
//         return new OracleConnection(config);
//     }
//     createSQLBuilder(): SQLBuilder {
//         return new OracleSQLBuilder();
//     }
// }
//# sourceMappingURL=DatabaseFactory.js.map