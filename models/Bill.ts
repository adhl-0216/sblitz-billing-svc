import { BillDAO } from '../dao/BillDAO';
import { ItemDAO } from '../dao/ItemDAO';
import { SplitDAO } from '../dao/SplitDAO';
import { Item } from './Item';
import { Split } from './Split';
import { Member } from './Member';

export class Bill {
    static async create(title: string, description: string, ownerId: string): Promise<string> {
        let current = new Date()
        return await BillDAO.create(title, description, ownerId, current, current);
    }

    static async addMember(billId: string, userId: string): Promise<void> {
        await Member.joinBill(userId, billId);
    }

    static async addItem(billId: string, name: string, description: string, price: number, quantity: number): Promise<void> {
        const newItem: Item = { name, description, price, quantity }
        await Item.addToBill(billId, newItem);
    }

    static async getTotalPrice(billId: string): Promise<number> {
        let total = 0
        //use stored procedures
        return total
    }
}
