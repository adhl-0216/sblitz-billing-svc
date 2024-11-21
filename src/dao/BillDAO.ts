import { Bill } from '@/models/Bill';
import { IDAO } from '@/dao/IDAO';
import { AbstractDatabaseFactory } from '@/db/Factory';
import { DatabaseConnection } from '@/db/Connection';
import { SQLBuilder } from '@/db/SqlBuilder';

export class BillDAO implements IDAO<Bill> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: any) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }

    async create(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'> & { owner_id: string }): Promise<Bill> {
        const columns = ['title', 'description', 'currency', 'total_amount', 'owner_id', 'created_at', 'updated_at'];
        const sql = this.sqlBuilder.insert('bills', columns);
        const params = [
            bill.title,
            bill.description || null,
            bill.currency,
            bill.total_amount,
            bill.owner_id,
            'CURRENT_TIMESTAMP',
            'CURRENT_TIMESTAMP'
        ];

        try {
            const res = await this.connection.query(sql, params);
            return this.mapRowToBill(res.rows[0]);
        } catch (err) {
            console.error('Error creating bill:', err);
            throw new Error('Database error');
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

    async getById(id: string): Promise<Bill | null> {
        const columns = ['id', 'title', 'description', 'currency', 'total_amount', 'owner_id', 'created_at', 'updated_at'];
        const sql = this.sqlBuilder.select('bills', columns, 'id = $1');

        try {
            const res = await this.connection.query(sql, [id]);

            if (res.rows.length === 0) {
                return null;
            }

            return this.mapRowToBill(res.rows[0]);
        } catch (err) {
            console.error('Error fetching bill:', err);
            throw new Error('Database error');
        }
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

    private mapRowToBill(row: any): Bill {
        return {
            ...row,
            total_amount: parseFloat(row.total_amount),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at)
        };
    }
}

