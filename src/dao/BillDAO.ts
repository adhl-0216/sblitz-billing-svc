import { Bill } from '@/models/Bill';
import { IDAO } from '@/dao/IDAO';
import { AbstractDatabaseFactory } from '@/db/DatabaseFactory';
import { ConnectionConfig, DatabaseConnection } from '@/db/Connection';
import { SQLBuilder } from '@/db/SqlBuilder';
import { Member } from '@/models/Member';
import { Item } from '@/models/Item';
import { UUID } from 'crypto';

export class BillDAO implements IDAO<Bill> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: ConnectionConfig) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }

    async create(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>): Promise<Bill> {
        const transaction = await this.connection.beginTransaction();

        try {
            // Insert bill
            const billColumns = ['title', 'description', 'currency', 'total_amount', 'owner_id'];
            const billSql = this.sqlBuilder.insert('bills', billColumns);
            const billParams = [
                bill.title,
                bill.description,
                bill.currency,
                bill.total_amount,
                bill.owner_id
            ];
            const billResult = await transaction.query(billSql, billParams);
            const newBillId = billResult.rows[0].id;

            // Insert items
            const itemColumns = ['bill_id', 'name', 'price', 'split_type'];
            const itemSql = this.sqlBuilder.insert('bill_items', itemColumns);
            for (const item of bill.items) {
                const itemParams = [newBillId, item.name, item.price, item.splitType];
                await transaction.query(itemSql, itemParams);
            }

            // Insert members
            const memberColumns = ['bill_id', 'color_code'];
            const memberSql = this.sqlBuilder.insert('bill_members', memberColumns);
            for (const member of bill.members) {
                const memberParams = [newBillId, member.color_code];
                await transaction.query(memberSql, memberParams);
            }

            await transaction.commit();

            // Fetch the newly created bill with its items and members
            return this.getById(newBillId);
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating bill with items and members:', error);
            throw new Error('Failed to create bill with items and members');
        }
    }

    async update(id: string, updatedData: Partial<Bill>): Promise<Bill> {
        const columns = ['title', 'description', 'currency', 'total_amount', 'updated_at'];
        const sql = this.sqlBuilder.update('bills', columns, 'id = $6');
        const params = [
            updatedData.title,
            updatedData.description,
            updatedData.currency,
            updatedData.total_amount,
            'CURRENT_TIMESTAMP',
            id
        ];

        try {
            const res = await this.connection.query(sql, params);
            if (res.rows.length === 0) {
                throw new Error('Bill not found');
            }
            return this.mapRowToBill(res.rows[0]);
        } catch (err) {
            console.error('Error updating bill:', err);
            throw new Error('Database error');
        }
    }

    async delete(id: string): Promise<boolean> {
        const sql = this.sqlBuilder.delete('bills', 'id = $1');

        try {
            const res = await this.connection.query(sql, [id]);
            return res.rowCount > 0;
        } catch (err) {
            console.error('Error deleting bill:', err);
            throw new Error('Database error');
        }
    }

    async getAll(): Promise<Bill[]> {
        const columns = ['id', 'title', 'description', 'currency', 'total_amount', 'owner_id', 'created_at', 'updated_at'];
        const sql = this.sqlBuilder.select('bills', columns);

        try {
            const res = await this.connection.query(sql);
            return res.rows.map(this.mapRowToBill);
        } catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error');
        }
    }

    async getById(id: UUID): Promise<Bill> {
        // Fetch bill
        const billSql = this.sqlBuilder.select('bills', ['*'], 'id = ?');
        const billResult = await this.connection.query(billSql, [id]);
        if (billResult.rows.length === 0) {
            throw new Error('Bill not found');
        }
        const bill = this.mapRowToBill(billResult.rows[0]);

        // Fetch items
        const itemsSql = this.sqlBuilder.select('bill_items', ['*'], 'bill_id = ?');
        const itemsResult = await this.connection.query(itemsSql, [id]);
        bill.items = itemsResult.rows.map(this.mapRowToItem);

        // Fetch members
        const membersSql = this.sqlBuilder.select('bill_members', ['*'], 'bill_id = ?');
        const membersResult = await this.connection.query(membersSql, [id]);
        bill.members = membersResult.rows.map(this.mapRowToMember);

        return bill;
    }

    private mapRowToBill(row: any): Bill {
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            currency: row.currency,
            total_amount: parseFloat(row.total_amount),
            owner_id: row.owner_id,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            items: [],
            members: []
        };
    }

    private mapRowToItem(row: any): Item {
        return {
            id: row.id,
            name: row.name,
            price: parseFloat(row.price),
            quantity: parseInt(row.quantity),
            splitType: row.split_type,
            splits: []
        };
    }

    private mapRowToMember(row: any): Member {
        return {
            member_id: row.id,
            color_code: row.color_code
        };
    }

    async getBillsByUserId(userId: string): Promise<Bill[]> {
        const columns = ['id', 'title', 'description', 'currency', 'total_amount', 'owner_id', 'created_at', 'updated_at'];
        const sql = this.sqlBuilder.select('bills', columns, 'owner_id = $1');

        try {
            const res = await this.connection.query(sql, [userId]);
            return res.rows.map(this.mapRowToBill);
        } catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error');
        }
    }
}

