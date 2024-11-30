import { PostgresSQLBuilder } from '@/db/SqlBuilder';

describe('PostgresSQLBuilder', () => {
    let sqlBuilder: PostgresSQLBuilder;

    beforeEach(() => {
        sqlBuilder = new PostgresSQLBuilder();
    });

    describe('insert', () => {
        it('should generate correct INSERT query', () => {
            const query = sqlBuilder.insert('users', ['name', 'email', 'age']);
            expect(query).toBe('INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *');
        });
    });

    describe('update', () => {
        it('should generate correct UPDATE query', () => {
            const query = sqlBuilder.update('users', ['name', 'email'], 'id = $3');
            expect(query).toBe('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *');
        });
    });

    describe('delete', () => {
        it('should generate correct DELETE query', () => {
            const query = sqlBuilder.delete('users', 'id = $1');
            expect(query).toBe('DELETE FROM users WHERE id = $1');
        });
    });

    describe('select', () => {
        it('should generate correct SELECT query without WHERE clause', () => {
            const query = sqlBuilder.select('users', ['id', 'name', 'email']);
            expect(query).toBe('SELECT id, name, email FROM users');
        });

        it('should generate correct SELECT query with WHERE clause', () => {
            const query = sqlBuilder.select('users', ['id', 'name', 'email'], 'age > $1');
            expect(query).toBe('SELECT id, name, email FROM users WHERE age > $1');
        });
    });
});
