"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillController = void 0;
const util_1 = require("@/util");
class BillController {
    billService;
    constructor(billService) {
        this.billService = billService;
    }
    errorHandler(res, error) {
        if (error.message === 'UserId not found in request headers') {
            res.status(400).json({ error: 'Bad request: userId is required' });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async createBill(req, res) {
        try {
            const userId = (0, util_1.getUserId)(req);
            const bill = req.body;
            if (!bill) {
                throw new Error('Request body is missing');
            }
            const newBill = await this.billService.createBill(userId, bill);
            res.status(201).json(newBill);
        }
        catch (error) {
            console.error('Error creating bill:', error);
            this.errorHandler(res, error);
        }
    }
    async getAllBillsByUserId(req, res) {
        try {
            const userId = (0, util_1.getUserId)(req);
            const bills = await this.billService.getBillsByUserId(userId);
            res.json(bills);
        }
        catch (error) {
            console.error('Error fetching bills for user:', error);
            this.errorHandler(res, error);
        }
    }
    async getBillById(req, res) {
        const billId = req.params.billId;
        if (!billId) {
            res.status(400).json({ message: 'Bill ID is required' });
        }
        try {
            const userId = (0, util_1.getUserId)(req);
            const bill = await this.billService.getBillById(userId, billId);
            if (bill) {
                res.json(bill);
            }
            else {
                res.status(404).json({ error: 'Bill not found' });
            }
        }
        catch (error) {
            console.error('Error fetching bill:', error);
            this.errorHandler(res, error);
        }
    }
    async updateBill(req, res) {
        try {
            const userId = (0, util_1.getUserId)(req);
            const billId = req.params.billId;
            const updatedBill = await this.billService.updateBill(userId, billId, req.body);
            if (updatedBill) {
                res.json(updatedBill);
            }
            else {
                res.status(404).json({ error: 'Bill not found' });
            }
        }
        catch (error) {
            console.error('Error updating bill:', error);
            this.errorHandler(res, error);
        }
    }
    async deleteBill(req, res) {
        const billId = req.params.billId;
        if (!billId) {
            res.status(400).json({ message: 'Bill ID is required' });
        }
        try {
            const userId = (0, util_1.getUserId)(req);
            const result = await this.billService.deleteBill(userId, billId);
            if (result) {
                res.status(204).send();
            }
            else {
                res.status(404).json({ error: 'Bill not found' });
            }
        }
        catch (error) {
            console.error('Error deleting bill:', error);
            this.errorHandler(res, error);
        }
    }
}
exports.BillController = BillController;
//# sourceMappingURL=BillController.js.map