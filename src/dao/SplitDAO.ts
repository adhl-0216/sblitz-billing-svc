import { Split } from "@/models/Split";
import { IDAO } from "./IDAO";
import { DatabaseConnection } from "@/db/Connection";
import { SQLBuilder } from "@/db/SqlBuilder";
import { AbstractDatabaseFactory } from "@/db/DatabaseFactory";
import { UUID } from "crypto";

export class SplitDAO implements IDAO<Split> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: any) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = databaseFactory.createSQLBuilder();
    }
    create(entity: Omit<Split, "id">): Promise<UUID> {
        throw new Error("Method not implemented.");
    }
    update(id: string | number, entity: Partial<Split>): Promise<UUID> {
        throw new Error("Method not implemented.");
    }
    delete(id: string | number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Split[]> {
        throw new Error("Method not implemented.");
    }
    getById(id: string | number): Promise<Split> {
        throw new Error("Method not implemented.");
    }
}