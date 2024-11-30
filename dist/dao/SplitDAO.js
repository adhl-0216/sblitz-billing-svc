"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitDAO = void 0;
class SplitDAO {
    connection;
    sqlBuilder;
    constructor(databaseFactory, config) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }
    create(entity) {
        throw new Error("Method not implemented.");
    }
    update(id, entity) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        throw new Error("Method not implemented.");
    }
    getById(id) {
        throw new Error("Method not implemented.");
    }
}
exports.SplitDAO = SplitDAO;
//# sourceMappingURL=SplitDAO.js.map