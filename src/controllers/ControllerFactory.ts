import { BillController } from '@/controllers/BillController';
import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { PostgresFactory } from '@/db/DatabaseFactory';
import { ConnectionConfig } from '@/db/Connection';

export interface IAbstractControllerFactory<T> {
    createController(connectionConfig: ConnectionConfig): T;
}


export class BillControllerFactory implements IAbstractControllerFactory<BillController> {
    createController(connectionConfig: ConnectionConfig): BillController {
        const postgresFactory = new PostgresFactory()
        const billDAO = new BillDAO(postgresFactory, connectionConfig);
        const billService = new BillService(billDAO);
        return new BillController(billService);
    }
}
