export interface SQLBuilder {
    insert(table: string, columns: string[]): string;
    update(table: string, columns: string[], whereClause: string): string;
    delete(table: string, whereClause: string): string;
    select(table: string, columns: string[], whereClause?: string): string;
}

export class PostgresSQLBuilder implements SQLBuilder {
    insert(table: string, columns: string[]): string {
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    }

    update(table: string, columns: string[], whereClause: string): string {
        const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        return `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    }

    delete(table: string, whereClause: string): string {
        return `DELETE FROM ${table} WHERE ${whereClause}`;
    }

    select(table: string, columns: string[], whereClause?: string): string {
        const baseQuery = `SELECT ${columns.join(', ')} FROM ${table}`;
        return whereClause ? `${baseQuery} WHERE ${whereClause}` : baseQuery;
    }
}


export class OracleSQLBuilder implements SQLBuilder {
    // Implement Oracle-specific SQL building methods
    insert(table: string, columns: string[]): string {
        return "Not implemented"
    }

    update(table: string, columns: string[], whereClause: string): string {
        return "Not implemented"
    }

    delete(table: string, whereClause: string): string {
        return "Not implemented"
    }

    select(table: string, columns: string[], whereClause?: string): string {
        return "Not implemented"
    }
}

export function createSQLBuilder(type: 'postgres' | 'oracle'): SQLBuilder {
    switch (type) {
        case 'postgres':
            return new PostgresSQLBuilder();
        case 'oracle':
            return new OracleSQLBuilder();
        default:
            throw new Error('Unsupported database type');
    }
}
