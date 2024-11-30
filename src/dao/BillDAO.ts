import { Bill } from '@/models/Bill';
import { IDAO } from '@/dao/IDAO';
import { AbstractDatabaseFactory } from '@/db/DatabaseFactory';
import { ConnectionConfig, DatabaseConnection } from '@/db/Connection';
import { SQLBuilder } from '@/db/SqlBuilder';
import { Member } from '@/models/Member';
import { Item, SplitType } from '@/models/Item';
import { randomUUID, UUID } from 'crypto';

export class BillDAO implements IDAO<Bill> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: ConnectionConfig) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }

    async create(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>): Promise<UUID> {

        const transaction = await this.connection.beginTransaction();

        try {

            const billColumns = ['title', 'description', 'currency', 'total_amount', 'owner_id'];
            const billSql = this.sqlBuilder.insert('bills', billColumns);
            const billParams = [
                bill.title,
                bill.description,
                bill.currency,
                bill.totalAmount !== undefined ? parseFloat(bill.totalAmount.toFixed(2)) : "0.00",
                bill.ownerId
            ];
            const billResult = await transaction.query(billSql, billParams);
            const newBillId = billResult.rows[0].id;

            // Insert items
            const itemColumns = ['bill_id', 'name', 'price', 'quantity'];
            const itemSql = this.sqlBuilder.insert('bill_items', itemColumns);
            for (const item of bill.items) {
                const itemParams = [newBillId, item.name, item.price, item.quantity];
                await transaction.query(itemSql, itemParams);
            }

            // Insert members
            const memberColumns = ['bill_id', 'id', 'name', 'color_code'];
            const memberSql = this.sqlBuilder.insert('bill_members', memberColumns);
            for (const member of bill.members) {
                const memberParams = [newBillId, randomUUID(), member.name, member.colorCode];
                await transaction.query(memberSql, memberParams);
            }

            await transaction.commit();


            return newBillId as UUID;

        } catch (error) {
            await transaction.rollback();
            console.error('Error creating bill with items and members:', error);
            throw new Error('Failed to create bill with items and members');
        }
    }

    async update(id: string, updatedData: Partial<Bill>): Promise<UUID> {
        const columns = ['title', 'description', 'currency', 'total_amount', 'updated_at'];
        const sql = this.sqlBuilder.update('bills', columns, 'id = $6');
        const params = [
            updatedData.title,
            updatedData.description,
            updatedData.currency,
            updatedData.totalAmount,
            'CURRENT_TIMESTAMP',
            id
        ];

        try {
            const res = await this.connection.query(sql, params);
            if (res.rows.length === 0) {
                throw new Error('Bill not found');
            }

            return res.row.id

        } catch (err) {
            console.error('Error updating bill:', err);
            throw new Error('Database error');
        }
    }

    async delete(id: string): Promise<boolean> {
        const transaction = await this.connection.beginTransaction();

        try {
            const sqlTruncateItemSplit = this.sqlBuilder.delete('item_split', `bill_item_id IN (SELECT id FROM bill_items WHERE bill_id = $1)`);
            await transaction.query(sqlTruncateItemSplit, [id]); // Truncate the item_split table first
            const sqlTruncateBillItems = this.sqlBuilder.delete('bill_items', 'bill_id = $1');
            await transaction.query(sqlTruncateBillItems, [id]); // Then truncate the bill_items table
            const sqlTruncateBillMembers = this.sqlBuilder.delete('bill_members', 'bill_id = $1');
            await transaction.query(sqlTruncateBillMembers, [id]); // Then truncate the bill_members table

            const sqlDeleteBill = this.sqlBuilder.delete('bills', 'id = $1');
            const res = await transaction.query(sqlDeleteBill, [id]);

            await transaction.commit();

            return res.rowCount > 0;
        } catch (err) {
            await transaction.rollback();
            console.error('Error deleting bill:', err);
            throw new Error('Database error');
        }
    }

    async getById(id: string): Promise<Bill | null> {
        const columns = [
            'bills.id AS bill_id',
            'bills.title',
            'bills.description',
            'bills.currency',
            'bills.total_amount',
            'bills.owner_id',
            'bills.created_at',
            'bills.updated_at',
            'bill_members.id AS member_id',
            'bill_members.name AS member_name',
            'bill_members.color_code AS member_color_code',
            'bill_items.id AS item_id',
            'bill_items.name AS item_name',
            'bill_items.price AS item_price',
            'bill_items.quantity AS item_quantity',
            'bill_items.split_type AS item_split_type'
        ];

        const sql = `
    SELECT 
        ${columns.join(', ')}
    FROM 
        bills
    LEFT JOIN 
        bill_members ON bill_members.bill_id = bills.id
    LEFT JOIN 
        bill_items ON bill_items.bill_id = bills.id
    WHERE 
        bills.id = $1
    `;

        try {
            const res = await this.connection.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            const billsMap: Record<string, Bill> = {};

            for (const row of res.rows) {
                const billId = row.bill_id;

                if (!billsMap[billId]) {
                    billsMap[billId] = {
                        id: row.bill_id,
                        title: row.title,
                        description: row.description,
                        currency: row.currency,
                        totalAmount: row.total_amount,
                        ownerId: row.owner_id,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                        items: [],
                        members: []
                    };
                }

                if (row.member_id) {
                    const member: Member = {
                        id: row.member_id,
                        name: row.member_name,
                        colorCode: row.member_color_code
                    };
                    billsMap[billId].members.push(member);
                }

                if (row.item_id) {
                    const item: Item = {
                        id: row.item_id,
                        name: row.item_name,
                        price: row.item_price,
                        quantity: row.item_quantity,
                        splitType: row.item_split_type as SplitType,
                        splits: []
                    };
                    billsMap[billId].items.push(item);
                }
            }

            console.log(Object.values(billsMap)[0])
            return Object.values(billsMap)[0];
        } catch (err) {
            console.error('Error fetching bill by ID:', err);
            throw new Error('Database error');
        }
    }

    async getAll(userId: string): Promise<Bill[]> {
        const sql =
            `SELECT
            bills.id AS bill_id, 
            bills.title, 
            bills.description, 
            bills.currency, 
            bills.total_amount, 
            bills.owner_id, 
            bills.created_at, 
            bills.updated_at, 
            bill_members.id AS member_id, 
            bill_members.name, 
            bill_members.color_code, 
            bill_members.bill_id 
        FROM 
            bills
        LEFT JOIN 
            bill_members ON bill_members.bill_id = bills.id 
        WHERE  
            bills.owner_id = $1 `;

        try {
            const res = await this.connection.query(sql, [userId]);
            const billsMap: Record<string, Bill> = {};

            for (const row of res.rows) {
                const billId = row.bill_id;
                if (!billsMap[billId]) {
                    billsMap[billId] = {
                        id: billId,
                        title: row.title,
                        description: row.description,
                        currency: row.currency,
                        totalAmount: parseFloat(row.total_amount),
                        ownerId: row.owner_id,
                        createdAt: new Date(row.created_at),
                        updatedAt: new Date(row.updated_at),
                        items: [],
                        members: []
                    };
                }

                if (row.member_id) {
                    billsMap[billId].members.push({
                        id: row.member_id,
                        name: row.name,
                        colorCode: row.color_code || null
                    });
                }
            }

            return Object.values(billsMap);
        } catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error');
        }
    }

    async validateOwnership(billId: string, userId: string): Promise<boolean> {
        const sql = `
        SELECT COUNT(*) 
        FROM bills
        WHERE id = $1 AND owner_id = $2
    `;

        try {
            const res = await this.connection.query(sql, [billId, userId]);
            const count = parseInt(res.rows[0].count, 10);
            return count > 0; // Returns true if the count is greater than 0, indicating ownership
        } catch (err) {
            console.error('Error validating bill ownership:', err);
            throw new Error('Database error during ownership validation');
        }
    }

}
