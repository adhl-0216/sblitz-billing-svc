import { BillDAO } from '@/dao/BillDAO';
import { Bill } from '@/models/Bill';
import { UUID } from 'crypto';

export class BillService {
    constructor(private billDAO: BillDAO) { }


    async createBill(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>): Promise<Bill> {
        return this.billDAO.create(bill);
    }
    async getAllBills(): Promise<Bill[]> {
        return this.billDAO.getAll();
    }

    async getBillById(id: UUID): Promise<Bill | null> {
        return this.billDAO.getById(id);
    }

    async getBillsByUserId(user_id: string): Promise<Bill[] | null> {
        return this.billDAO.getBillsByUserId(user_id);
    }

    async updateBill(id: string, bill: Partial<Bill>): Promise<Bill | null> {
        return this.billDAO.update(id, bill);
    }

    async deleteBill(id: string): Promise<boolean> {
        return this.billDAO.delete(id);
    }
}
