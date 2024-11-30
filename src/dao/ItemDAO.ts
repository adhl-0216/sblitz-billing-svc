import { Item, SplitType } from '../models/Item';
import { DatabaseConnection } from '@/db/Connection';
import { SQLBuilder, PostgresSQLBuilder } from '@/db/SqlBuilder';
import { AbstractDatabaseFactory } from '@/db/DatabaseFactory';
import { IDAO } from './IDAO';
import { UUID } from 'crypto';

export class ItemDAO implements IDAO<Item> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: any) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = new PostgresSQLBuilder();
    }

    async create(entity: Omit<Item, 'id'>): Promise<UUID> {
        const columns = ['name', 'price', 'quantity', 'split_type'];
        const query = this.sqlBuilder.insert('items', columns);
        const values = [entity.name, entity.price, entity.quantity, entity.splitType];

        return await this.connection.query(query, values);
    }

    async update(id: string | number, entity: Partial<Item>): Promise<UUID> {
        const columns = Object.keys(entity);
        const values = Object.values(entity);
        const query = this.sqlBuilder.update('items', columns, 'id = $' + (columns.length + 1));

        const result = await this.connection.query(query, [...values, id]);
        return result.row.id
    }

    async delete(id: string | number): Promise<boolean> {
        const query = this.sqlBuilder.delete('items', 'id = $1');
        const result = await this.connection.query(query, [id]);
        return result.rowCount > 0;
    }

    async getAll(): Promise<Item[]> {
        const query = this.sqlBuilder.select('items', ['*']);
        const result = await this.connection.query(query);
        return result.rows.map(this.mapRowToItem);
    }

    async getById(id: string | number): Promise<Item> {
        const query = this.sqlBuilder.select('items', ['*'], 'id = $1');
        const result = await this.connection.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Item not found');
        }
        return this.mapRowToItem(result.rows[0]);
    }

    // Additional methods

    async getByName(name: string): Promise<Item[]> {
        const query = this.sqlBuilder.select('items', ['*'], 'name ILIKE $1');
        const result = await this.connection.query(query, [`%${name}%`]);
        return result.rows.map(this.mapRowToItem);
    }

    async getBySplitType(splitType: SplitType): Promise<Item[]> {
        const query = this.sqlBuilder.select('items', ['*'], 'split_type = $1');
        const result = await this.connection.query(query, [splitType]);
        return result.rows.map(this.mapRowToItem);
    }

    async getTotalValue(): Promise<number> {
        const query = this.sqlBuilder.select('items', ['SUM(price * quantity) as total_value']);
        const result = await this.connection.query(query);
        return parseFloat(result.rows[0].total_value) || 0;
    }

    private mapRowToItem(row: any): Item {
        return {
            id: row.id as UUID,
            name: row.name,
            price: parseFloat(row.price),
            quantity: parseInt(row.quantity),
            splitType: row.split_type as SplitType,
            splits: []
        };
    }
}
