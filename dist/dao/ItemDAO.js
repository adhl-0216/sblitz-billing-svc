"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDAO = void 0;
const SqlBuilder_1 = require("@/db/SqlBuilder");
class ItemDAO {
    connection;
    sqlBuilder;
    constructor(databaseFactory, config) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = new SqlBuilder_1.PostgresSQLBuilder();
    }
    async create(entity) {
        const columns = ['name', 'price', 'quantity', 'split_type'];
        const query = this.sqlBuilder.insert('items', columns);
        const values = [entity.name, entity.price, entity.quantity, entity.splitType];
        return await this.connection.query(query, values);
    }
    async update(id, entity) {
        const columns = Object.keys(entity);
        const values = Object.values(entity);
        const query = this.sqlBuilder.update('items', columns, 'id = $' + (columns.length + 1));
        const result = await this.connection.query(query, [...values, id]);
        return result.row.id;
    }
    async delete(id) {
        const query = this.sqlBuilder.delete('items', 'id = $1');
        const result = await this.connection.query(query, [id]);
        return result.rowCount > 0;
    }
    async getAll() {
        const query = this.sqlBuilder.select('items', ['*']);
        const result = await this.connection.query(query);
        return result.rows.map(this.mapRowToItem);
    }
    async getById(id) {
        const query = this.sqlBuilder.select('items', ['*'], 'id = $1');
        const result = await this.connection.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Item not found');
        }
        return this.mapRowToItem(result.rows[0]);
    }
    // Additional methods
    async getByName(name) {
        const query = this.sqlBuilder.select('items', ['*'], 'name ILIKE $1');
        const result = await this.connection.query(query, [`%${name}%`]);
        return result.rows.map(this.mapRowToItem);
    }
    async getBySplitType(splitType) {
        const query = this.sqlBuilder.select('items', ['*'], 'split_type = $1');
        const result = await this.connection.query(query, [splitType]);
        return result.rows.map(this.mapRowToItem);
    }
    async getTotalValue() {
        const query = this.sqlBuilder.select('items', ['SUM(price * quantity) as total_value']);
        const result = await this.connection.query(query);
        return parseFloat(result.rows[0].total_value) || 0;
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
}
exports.ItemDAO = ItemDAO;
//# sourceMappingURL=ItemDAO.js.map