import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { Bill } from '@/models/Bill';

jest.mock('@/dao/BillDAO'); // Mock the BillDAO

describe('BillService', () => {
    let billService: BillService;
    let billDAOMock: jest.Mocked<BillDAO>;

    beforeEach(() => {
        billDAOMock = new BillDAO(null, null) as jest.Mocked<BillDAO>;
        billService = new BillService(billDAOMock);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls and instances after each test
    });

    it('should fetch all bills', async () => {
        const mockBills: Bill[] = [
            { id: '1', title: 'Bill 1', description: 'Description 1', currency: 'USD', total_amount: 100, created_at: new Date(), updated_at: new Date() },
            { id: '2', title: 'Bill 2', description: 'Description 2', currency: 'USD', total_amount: 200, created_at: new Date(), updated_at: new Date() },
        ];

        billDAOMock.getAll.mockResolvedValue(mockBills); // Mock implementation

        const bills = await billService.getAllBills();

        expect(bills).toEqual(mockBills);
        expect(billDAOMock.getAll).toHaveBeenCalledTimes(1); // Ensure getAll was called once
    });

    it('should create a new bill', async () => {
        const newBillData = { title: 'New Bill', description: 'New Description', currency: 'USD', total_amount: 150 };
        const createdBill: Bill = { id: '3', ...newBillData, created_at: new Date(), updated_at: new Date() };

        billDAOMock.create.mockResolvedValue(createdBill); // Mock implementation

        const result = await billService.createBill(newBillData);

        expect(result).toEqual(createdBill);
        expect(billDAOMock.create).toHaveBeenCalledWith(newBillData); // Ensure create was called with correct data
    });

    it('should fetch a bill by ID', async () => {
        const mockBillId = '1';
        const mockBill: Bill = { id: mockBillId, title: 'Mock Bill', description: 'Mock Description', currency: 'USD', total_amount: 100, created_at: new Date(), updated_at: new Date() };

        billDAOMock.getById.mockResolvedValue(mockBill); // Mock implementation

        const bill = await billService.getBillById(mockBillId);

        expect(bill).toEqual(mockBill);
        expect(billDAOMock.getById).toHaveBeenCalledWith(mockBillId); // Ensure getById was called with correct ID
    });

    it('should return null if bill not found by ID', async () => {
        const mockBillId = '999'; // Non-existent ID
        billDAOMock.getById.mockResolvedValue(null); // Mock implementation

        const bill = await billService.getBillById(mockBillId);

        expect(bill).toBeNull();
        expect(billDAOMock.getById).toHaveBeenCalledWith(mockBillId); // Ensure getById was called with correct ID
    });

    it('should update a bill by ID', async () => {
        const mockBillId = '1';
        const updatedData = { title: 'Updated Title' };
        const updatedBill: Bill = { id: mockBillId, title: 'Updated Title', description: 'Mock Description', currency: 'USD', total_amount: 100, created_at: new Date(), updated_at: new Date() };

        billDAOMock.update.mockResolvedValue(updatedBill); // Mock implementation

        const result = await billService.updateBill(mockBillId, updatedData);

        expect(result).toEqual(updatedBill);
        expect(billDAOMock.update).toHaveBeenCalledWith(mockBillId, updatedData); // Ensure update was called with correct data
    });

    it('should delete a bill by ID', async () => {
        const mockBillId = '1';

        billDAOMock.delete.mockResolvedValue(true); // Mock implementation

        const result = await billService.deleteBill(mockBillId);

        expect(result).toBe(true);
        expect(billDAOMock.delete).toHaveBeenCalledWith(mockBillId); // Ensure delete was called with correct ID
    });
});
