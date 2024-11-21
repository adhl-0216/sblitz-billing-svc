import { Pool } from 'pg';
import { Item } from '../models/Item';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export class ItemDAO {
    static async create(billId: string, item: Item): Promise<string> {
        const query = `INSERT INTO bill_items (bill_id, name, price) VALUES ($1, $2, $3) RETURNING id;`;
        const values = [billId, item.name, item.price];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0].id;
        } catch (err) {
            console.error('Error creating item:', err);
            throw new Error('Database error');
        }
    }

    static async getItemsByBillId(billId: string): Promise<any[]> {
        const query = `SELECT * FROM bill_items WHERE bill_id = $1;`;

        try {
            const { rows } = await pool.query(query, [billId]);
            return rows;
        } catch (err) {
            console.error('Error fetching items:', err);
            throw new Error('Database error');
        }
    }

    static async getItemById(itemId: string): Promise<any> {
        const query = `SELECT * FROM bill_items WHERE id = $1;`;

        try {
            const { rows } = await pool.query(query, [itemId]);
            return rows[0];
        } catch (err) {
            console.error('Error fetching item:', err);
            throw new Error('Database error');
        }
    }

    static async delete(itemId: string): Promise<void> {
        const query = `DELETE FROM bill_items WHERE id = $1;`;

        try {
            await pool.query(query, [itemId]);
        } catch (err) {
            console.error('Error deleting item:', err);
            throw new Error('Database error');
        }
    }
}
