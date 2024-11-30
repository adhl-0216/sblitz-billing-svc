"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
class BillService {
    billDAO;
    constructor(billDAO) {
        this.billDAO = billDAO;
    }
    async checkOwnership(billId, userId) {
        const isOwner = await this.billDAO.validateOwnership(billId, userId);
        if (!isOwner) {
            throw new Error('Unauthorized access to bill');
        }
    }
    async createBill(userId, bill) {
        bill.owner_id = userId;
        return await this.billDAO.create(bill);
    }
    async getBillsByUserId(userId) {
        let bills = await this.billDAO.getBillsByUserId(userId);
        return bills;
    }
    async getBillById(userId, billId) {
        await this.checkOwnership(billId, userId);
        return await this.billDAO.getById(billId);
    }
    async updateBill(userId, billId, bill) {
        await this.checkOwnership(billId, userId);
        return await this.billDAO.update(billId, bill);
    }
    async deleteBill(userId, billId) {
        await this.checkOwnership(billId, userId);
        return await this.billDAO.delete(billId);
    }
}
exports.BillService = BillService;
//# sourceMappingURL=BillService.js.map