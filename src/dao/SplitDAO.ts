import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export class SplitDAO {
    static async create(billItemId: string, assigneeId: string, amount: number): Promise<string> {
        const query = `INSERT INTO split (bill_item_id, assignee_id, amount) VALUES ($1, $2, $3) RETURNING id;`;
        const values = [billItemId, assigneeId, amount];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0].id;
        } catch (err) {
            console.error('Error creating split:', err);
            throw new Error('Database error');
        }
    }

    static async getByBillItemId(billItemId: string): Promise<any[]> {
        const query = `SELECT * FROM split WHERE bill_item_id = $1;`;

        try {
            const { rows } = await pool.query(query, [billItemId]);
            return rows;
        } catch (err) {
            console.error('Error fetching splits:', err);
            throw new Error('Database error');
        }
    }

    static async delete(splitId: string): Promise<void> {
        const query = `DELETE FROM split WHERE id = $1;`;

        try {
            await pool.query(query, [splitId]);
        } catch (err) {
            console.error('Error deleting split:', err);
            throw new Error('Database error');
        }
    }
}
