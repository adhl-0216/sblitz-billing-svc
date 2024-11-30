"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillControllerFactory = void 0;
const BillController_1 = require("@/controllers/BillController");
const BillService_1 = require("@/services/BillService");
const BillDAO_1 = require("@/dao/BillDAO");
const DatabaseFactory_1 = require("@/db/DatabaseFactory");
class BillControllerFactory {
    createController(connectionConfig) {
        const postgresFactory = new DatabaseFactory_1.PostgresFactory();
        const billDAO = new BillDAO_1.BillDAO(postgresFactory, connectionConfig);
        const billService = new BillService_1.BillService(billDAO);
        return new BillController_1.BillController(billService);
    }
}
exports.BillControllerFactory = BillControllerFactory;
//# sourceMappingURL=ControllerFactory.js.map