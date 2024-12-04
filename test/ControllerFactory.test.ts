import { BillControllerFactory } from '@/controllers/ControllerFactory';
import { BillController } from '@/controllers/BillController';
import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { PostgresFactory } from '@/db/DatabaseFactory';
import { ConnectionConfig } from '@/db/Connection';

jest.mock('@/controllers/BillController');
jest.mock('@/services/BillService');
jest.mock('@/dao/BillDAO');
jest.mock('@/db/DatabaseFactory');

describe('BillControllerFactory', () => {
    let factory: BillControllerFactory;
    let mockConnectionConfig: ConnectionConfig;

    beforeEach(() => {
        factory = new BillControllerFactory();
        mockConnectionConfig = {} as ConnectionConfig;
        jest.clearAllMocks();
    });

    it('should create a BillController with the correct dependencies', () => {
        const mockPostgresFactory = new PostgresFactory();
        const mockBillDAO = new BillDAO(mockPostgresFactory, mockConnectionConfig);
        const mockBillService = new BillService(mockBillDAO);
        const mockBillController = new BillController(mockBillService);

        (PostgresFactory as jest.MockedClass<typeof PostgresFactory>).mockImplementation(() => mockPostgresFactory);
        (BillDAO as jest.MockedClass<typeof BillDAO>).mockImplementation(() => mockBillDAO);
        (BillService as jest.MockedClass<typeof BillService>).mockImplementation(() => mockBillService);
        (BillController as jest.MockedClass<typeof BillController>).mockImplementation(() => mockBillController);

        const result = factory.createController(mockConnectionConfig);

        expect(PostgresFactory).toHaveBeenCalledTimes(2); // called once at line 24
        expect(BillDAO).toHaveBeenCalledWith(mockPostgresFactory, mockConnectionConfig);
        expect(BillService).toHaveBeenCalledWith(mockBillDAO);
        expect(BillController).toHaveBeenCalledWith(mockBillService);
        expect(result).toBe(mockBillController);
    });
});
