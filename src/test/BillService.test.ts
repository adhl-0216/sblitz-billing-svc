import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { Bill } from '@/models/Bill';
import { Item } from '@/models/Item';
import { Member } from '@/models/Member';
import { randomUUID } from 'crypto';

jest.mock('@/dao/BillDAO');

describe('BillService', () => {
    let billService: BillService;
    let billDAOMock: jest.Mocked<BillDAO>;

    beforeEach(() => {
        billDAOMock = new BillDAO(null, null) as jest.Mocked<BillDAO>;
        billService = new BillService(billDAOMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should create a new bill', async () => {
        const newBillData = {
            title: 'New Bill',
            description: 'New Description',
            currency: 'USD',
            total_amount: 150,
            owner_id: randomUUID(),
            items: [] as Item[],
            members: [] as Member[]
        };
        const createdBill: Bill = {
            id: randomUUID(),
            ...newBillData,
            created_at: new Date(),
            updated_at: new Date()
        };

        billDAOMock.create.mockResolvedValue(createdBill);

        const result = await billService.createBill(newBillData);

        expect(result).toEqual(createdBill);
        expect(billDAOMock.create).toHaveBeenCalledWith(newBillData);
    });

    it('should fetch a bill by ID', async () => {
        const mockBillId = randomUUID();
        const mockBill: Bill = {
            id: mockBillId,
            title: 'Mock Bill',
            description: 'Mock Description',
            currency: 'USD',
            total_amount: 100,
            owner_id: randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            items: [],
            members: []
        };

        billDAOMock.getById.mockResolvedValue(mockBill);

        const bill = await billService.getBillById(mockBillId);

        expect(bill).toEqual(mockBill);
        expect(billDAOMock.getById).toHaveBeenCalledWith(mockBillId);
    });

    it('should return null if bill not found by ID', async () => {
        const mockBillId = randomUUID();
        billDAOMock.getById.mockResolvedValue(null);

        const bill = await billService.getBillById(mockBillId);

        expect(bill).toBeNull();
        expect(billDAOMock.getById).toHaveBeenCalledWith(mockBillId);
    });

    it('should update a bill by ID', async () => {
        const mockBillId = randomUUID();
        const updatedData = { title: 'Updated Title' };
        const updatedBill: Bill = {
            id: mockBillId,
            title: 'Updated Title',
            description: 'Mock Description',
            currency: 'USD',
            total_amount: 100,
            owner_id: randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            items: [],
            members: []
        };

        billDAOMock.update.mockResolvedValue(updatedBill);

        const result = await billService.updateBill(mockBillId, updatedData);

        expect(result).toEqual(updatedBill);
        expect(billDAOMock.update).toHaveBeenCalledWith(mockBillId, updatedData);
    });

    it('should delete a bill by ID', async () => {
        const mockBillId = randomUUID();

        billDAOMock.delete.mockResolvedValue(true);

        const result = await billService.deleteBill(mockBillId);

        expect(result).toBe(true);
        expect(billDAOMock.delete).toHaveBeenCalledWith(mockBillId);
    });
});
