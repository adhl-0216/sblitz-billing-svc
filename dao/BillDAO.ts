import { query } from "../db"

export class BillDAO {
    static async create(
        title: string,
        description: string,
        ownerId: string,
        created_at: Date,
        updated_at: Date,
    ): Promise<string> {

        const sql = `
            INSERT INTO bills (title, description, owner_id, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id;
        `;

        const params = [title, description, ownerId, created_at, updated_at];

        try {
            const res = await query(sql, params);
            return res.rows[0].id;
        } catch (err) {
            console.error('Error creating bill:', err);
            throw new Error('Database error');
        }
    }

    static async getBillsByUserId(userId: string): Promise<any[]> {
        const sql = `
            SELECT * FROM bills 
            WHERE owner_id = $1;
        `;

        try {
            const res = await query(sql, [userId]); // Execute the query
            return res.rows; // Return the list of bills for the user
        } catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error'); // Handle any errors
        }
    }

    static async getBillById(billId: string): Promise<any> {
        const sql = `
            SELECT * FROM bills 
            WHERE id = $1;
        `;

        try {
            const res = await query(sql, [billId]); // Execute the query
            return res.rows[0]; // Return the bill if found
        } catch (err) {
            console.error('Error fetching bill:', err);
            throw new Error('Database error'); // Handle any errors
        }
    }

}
