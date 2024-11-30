"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillDAO = void 0;
const crypto_1 = require("crypto");
class BillDAO {
    connection;
    sqlBuilder;
    constructor(databaseFactory, config) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }
    async create(bill) {
        const transaction = await this.connection.beginTransaction();
        try {
            const billColumns = ['title', 'description', 'currency', 'total_amount', 'owner_id'];
            const billSql = this.sqlBuilder.insert('bills', billColumns);
            const billParams = [
                bill.title,
                bill.description,
                bill.currency,
                bill.total_amount !== undefined ? parseFloat(bill.total_amount.toFixed(2)) : "0.00",
                bill.owner_id
            ];
            const billResult = await transaction.query(billSql, billParams);
            const newBillId = billResult.rows[0].id;
            // Insert items
            const itemColumns = ['bill_id', 'name', 'price'];
            const itemSql = this.sqlBuilder.insert('bill_items', itemColumns);
            for (const item of bill.items) {
                const itemParams = [newBillId, item.name, item.price];
                await transaction.query(itemSql, itemParams);
            }
            // Insert members
            const memberColumns = ['bill_id', 'id', 'name', 'color_code'];
            const memberSql = this.sqlBuilder.insert('bill_members', memberColumns);
            for (const member of bill.members) {
                const memberParams = [newBillId, (0, crypto_1.randomUUID)(), member.name, member.colorCode];
                await transaction.query(memberSql, memberParams);
            }
            await transaction.commit();
            // Fetch the newly created bill with its items and members
            const newBill = await this.getById(newBillId);
            if (!newBill) {
                throw new Error('Bill not found');
            }
            return newBill;
        }
        catch (error) {
            await transaction.rollback();
            console.error('Error creating bill with items and members:', error);
            throw new Error('Failed to create bill with items and members');
        }
    }
    async update(id, updatedData) {
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
        }
        catch (err) {
            console.error('Error updating bill:', err);
            throw new Error('Database error');
        }
    }
    async delete(id) {
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
        }
        catch (err) {
            await transaction.rollback();
            console.error('Error deleting bill:', err);
            throw new Error('Database error');
        }
    }
    async getAll() {
        const columns = ['id', 'title', 'description', 'currency', 'total_amount', 'owner_id', 'created_at', 'updated_at'];
        const sql = this.sqlBuilder.select('bills', columns);
        try {
            const res = await this.connection.query(sql);
            return res.rows.map(this.mapRowToBill);
        }
        catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error');
        }
    }
    async getById(id) {
        const columns = [
            'bills.id AS bill_id', 'bills.title', 'bills.description', 'bills.currency',
            'bills.total_amount', 'bills.owner_id', 'bills.created_at', 'bills.updated_at',
            'bill_members.id AS member_id', 'bill_members.name', 'bill_members.color_code'
        ];
        const sql = `
    SELECT 
        ${columns.join(', ')}
    FROM 
        bills
    LEFT JOIN 
        bill_members ON bill_members.bill_id = bills.id
    WHERE 
        bills.id = $1
    `;
        try {
            const res = await this.connection.query(sql, [id]);
            if (res.rows.length === 0) {
                return null; // Bill not found
            }
            const billsMap = {};
            for (const row of res.rows) {
                const billId = row.bill_id;
                if (!billsMap[billId]) {
                    billsMap[billId] = this.mapRowToBill(row);
                }
                if (row.member_id) {
                    billsMap[billId].members.push(this.mapRowToMember(row));
                }
            }
            return Object.values(billsMap)[0]; // Return the first bill found
        }
        catch (err) {
            console.error('Error fetching bill by ID:', err);
            throw new Error('Database error');
        }
    }
    async validateOwnership(billId, userId) {
        const sql = `
        SELECT COUNT(*) 
        FROM bills
        WHERE id = $1 AND owner_id = $2
    `;
        try {
            const res = await this.connection.query(sql, [billId, userId]);
            const count = parseInt(res.rows[0].count, 10);
            return count > 0; // Returns true if the count is greater than 0, indicating ownership
        }
        catch (err) {
            console.error('Error validating bill ownership:', err);
            throw new Error('Database error during ownership validation');
        }
    }
    mapRowToBill(row) {
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            currency: row.currency,
            total_amount: row.total_amount,
            owner_id: row.owner_id,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            items: [],
            members: []
        };
    }
    mapRowToItem(row) {
        return {
            id: row.id,
            name: row.name,
            price: parseFloat(row.price),
            quantity: parseInt(row.quantity),
            splitType: row.split_type,
            splits: []
        };
    }
    mapRowToMember(row) {
        return {
            id: row.member_id,
            name: row.name,
            colorCode: row.color_code
        };
    }
    async getBillsByUserId(userId) {
        const columns = [
            'bills.id AS bill_id', 'bills.title', 'bills.description', 'bills.currency',
            'bills.total_amount', 'bills.owner_id', 'bills.created_at', 'bills.updated_at',
            'bill_members.id AS member_id', 'bill_members.name', 'bill_members.color_code', 'bill_members.bill_id'
        ];
        const sql = `
    SELECT 
        ${columns.join(', ')}
    FROM 
        bills
    LEFT JOIN 
        bill_members ON bill_members.bill_id = bills.id
    WHERE 
        bills.owner_id = $1
    `;
        try {
            const res = await this.connection.query(sql, [userId]);
            const billsMap = {};
            for (const row of res.rows) {
                const billId = row.bill_id;
                if (!billsMap[billId]) {
                    billsMap[billId] = {
                        id: billId,
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
                if (row.member_id) {
                    billsMap[billId].members.push({
                        id: row.member_id,
                        name: row.name,
                        colorCode: row.color_code || null
                    });
                }
            }
            return Object.values(billsMap);
        }
        catch (err) {
            console.error('Error fetching bills:', err);
            throw new Error('Database error');
        }
    }
}
exports.BillDAO = BillDAO;
//# sourceMappingURL=BillDAO.js.map