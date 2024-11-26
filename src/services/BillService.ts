import { BillDAO } from '@/dao/BillDAO';
import { Bill } from '@/models/Bill';
import { UUID } from 'crypto';

export class BillService {
    constructor(private billDAO: BillDAO) { }

    private async checkOwnership(billId: UUID, userId: string): Promise<void> {
        const bill = await this.billDAO.getById(billId);
        if (bill.owner_id !== userId) {
            throw new Error('Unauthorized access to bill');
        }
    }

    async createBill(userId: string, bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>): Promise<Bill> {
        bill.owner_id = userId
        return this.billDAO.create(bill);
    }

    async getBillsByUserId(userId: string): Promise<Bill[] | null> {
        return this.billDAO.getBillsByUserId(userId);
    }

    async getBillById(userId: string, billId: UUID): Promise<Bill | null> {
        await this.checkOwnership(billId, userId);
        return this.billDAO.getById(billId);
    }

    async updateBill(userId: string, billId: UUID, bill: Partial<Bill>): Promise<Bill | null> {
        await this.checkOwnership(billId, userId);
        return this.billDAO.update(billId, bill);
    }

    async deleteBill(userId: string, billId: UUID): Promise<boolean> {
        await this.checkOwnership(billId, userId);
        return this.billDAO.delete(billId);
    }
}
