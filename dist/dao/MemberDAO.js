"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberDAO = void 0;
const SqlBuilder_1 = require("@/db/SqlBuilder");
class MemberDAO {
    connection;
    sqlBuilder;
    constructor(databaseFactory, config) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = new SqlBuilder_1.PostgresSQLBuilder();
    }
    async create(entity) {
        const columns = ['color_code'];
        const query = this.sqlBuilder.insert('members', columns);
        const values = [entity.colorCode];
        const result = await this.connection.query(query, values);
        return this.mapRowToMember(result.rows[0]);
    }
    async update(id, entity) {
        const columns = Object.keys(entity);
        const values = Object.values(entity);
        const query = this.sqlBuilder.update('members', columns, 'member_id = $' + (columns.length + 1));
        const result = await this.connection.query(query, [...values, id]);
        return this.mapRowToMember(result.rows[0]);
    }
    async delete(id) {
        const query = this.sqlBuilder.delete('members', 'member_id = $1');
        const result = await this.connection.query(query, [id]);
        return result.rowCount > 0;
    }
    async getAll() {
        const query = this.sqlBuilder.select('members', ['*']);
        const result = await this.connection.query(query);
        return result.rows.map(this.mapRowToMember);
    }
    async getById(id) {
        const query = this.sqlBuilder.select('members', ['*'], 'member_id = $1');
        const result = await this.connection.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Member not found');
        }
        return this.mapRowToMember(result.rows[0]);
    }
    async getTotalMembers() {
        const query = this.sqlBuilder.select('members', ['COUNT(*) as total']);
        const result = await this.connection.query(query);
        return parseInt(result.rows[0].total);
    }
    mapRowToMember(row) {
        return {
            id: row.member_id,
            name: row.name,
            colorCode: row.color_code
        };
    }
}
exports.MemberDAO = MemberDAO;
//# sourceMappingURL=MemberDAO.js.map