import { BillController } from '@/controllers/BillController';
import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { PostgresFactory } from '@/db/DatabaseFactory';

export interface AbstractControllerFactory<T> {
    createController(): T;
}


export class BillControllerFactory implements AbstractControllerFactory<BillController> {
    createController(): BillController {
        const postgresFactory = new PostgresFactory()
        const billDAO = new BillDAO(postgresFactory, {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: Number(process.env.POSTGRES_PORT),
        });
        const billService = new BillService(billDAO);
        return new BillController(billService);
    }
}
