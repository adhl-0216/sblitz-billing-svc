import { Pool } from "pg"

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export class MemberDAO {
    static async create(userId: string, billId: string, colorCode: string, displayName: string): Promise<string> {
        const query = `INSERT INTO members (user_id, bill_id display_name, color_code) VALUES ($1, $2, $3, $4) RETURNING user_id;`;
        const values = [userId, billId, displayName, colorCode];

        try {
            const { rows } = await pool.query(query, values);
            return rows[0].id;
        } catch (err) {
            console.error('Error creating user:', err);
            throw new Error('Database error');
        }
    }

    static async getAll(): Promise<any[]> {
        const query = `SELECT * FROM members;`;

        try {
            const { rows } = await pool.query(query);
            return rows;
        } catch (err) {
            console.error('Error fetching users:', err);
            throw new Error('Database error');
        }
    }

    static async getById(userId: string): Promise<any> {
        const query = `SELECT * FROM members WHERE id = $1;`;

        try {
            const { rows } = await pool.query(query, [userId]);
            return rows[0];
        } catch (err) {
            console.error('Error fetching user:', err);
            throw new Error('Database error');
        }
    }

    static async delete(userId: string): Promise<void> {
        const query = `DELETE FROM members WHERE id = $1;`;

        try {
            await pool.query(query, [userId]);
        } catch (err) {
            console.error('Error deleting user:', err);
            throw new Error('Database error');
        }
    }

}
