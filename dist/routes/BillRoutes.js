"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ControllerFactory_1 = require("@/controllers/ControllerFactory");
const router = (0, express_1.Router)();
const billControllerFactory = new ControllerFactory_1.BillControllerFactory();
const connectionConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
};
const billController = billControllerFactory.createController(connectionConfig);
// Routes
router.get('/all-bills', (req, res, next) => billController.getAllBillsByUserId(req, res));
router.post('/create', (req, res, next) => billController.createBill(req, res));
router.get('/:billId', (req, res) => billController.getBillById(req, res));
router.put('/:billId', (req, res, next) => billController.updateBill(req, res));
router.delete('/:billId', (req, res, next) => billController.deleteBill(req, res));
exports.default = router;
//# sourceMappingURL=BillRoutes.js.map