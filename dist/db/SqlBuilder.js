"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSQLBuilder = void 0;
class PostgresSQLBuilder {
    insert(table, columns) {
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    }
    update(table, columns, whereClause) {
        const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        return `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    }
    delete(table, whereClause) {
        return `DELETE FROM ${table} WHERE ${whereClause}`;
    }
    select(table, columns, whereClause) {
        const baseQuery = `SELECT ${columns.join(', ')} FROM ${table}`;
        return whereClause ? `${baseQuery} WHERE ${whereClause}` : baseQuery;
    }
    truncate(table, whereClause) {
        const query = `TRUNCATE TABLE ${table}`;
        return whereClause ? `${query} WHERE ${whereClause}` : query;
    }
}
exports.PostgresSQLBuilder = PostgresSQLBuilder;
//# sourceMappingURL=SqlBuilder.js.map