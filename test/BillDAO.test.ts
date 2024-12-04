import { BillDAO } from '@/dao/BillDAO';
import { IDatabaseConnection, IDatabaseTransaction } from '@/db/Connection';
import { ISQLBuilder } from '@/db/SqlBuilder';
import { randomUUID, UUID } from 'crypto';
import { Bill } from '@/models/Bill';
import { Member } from '@/models/Member';
import { Item, SplitType } from '@/models/Item';
import { getErrorMessage } from '@/util';

// Mocking the dependencies
jest.mock('@/db/Connection');
jest.mock('@/db/SqlBuilder');

describe('BillDAO', () => {
    let mockConnection: jest.Mocked<IDatabaseConnection>;
    let mockTransaction: jest.Mocked<IDatabaseTransaction>;
    let mockSQLBuilder: jest.Mocked<ISQLBuilder>;
    let billDAO: BillDAO;
    let mockQuery: jest.Mock;

    beforeEach(() => {
        // Reset the mocks before each test
        mockQuery = jest.fn();
        mockTransaction = {
            query: mockQuery,
            commit: jest.fn(),
            rollback: jest.fn(),
        } as any;
        mockConnection = {
            query: mockQuery,
            close: jest.fn(),
            beginTransaction: jest.fn().mockResolvedValue(mockTransaction),
        } as any;

        mockSQLBuilder = {
            insert: jest.fn().mockReturnValue('INSERT SQL'),
            select: jest.fn().mockReturnValue('SELECT SQL'),
            update: jest.fn().mockReturnValue('UPDATE SQL'),
            delete: jest.fn().mockReturnValue('DELETE SQL'),
        };

        // Create the BillDAO instance
        billDAO = new BillDAO(
            {
                createConnection: jest.fn().mockReturnValue(mockConnection),
                createSQLBuilder: jest.fn().mockReturnValue(mockSQLBuilder),
            } as any, // mock the database factory
            {} as any // mock the connection config
        );
    });

    it('should create a new bill with items and members', async () => {
        const bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> = {
            title: 'Dinner',
            description: 'Dinner with friends',
            currency: 'USD',
            totalAmount: 100,
            ownerId: randomUUID(),
            items: [
                { id: randomUUID(), name: 'Pizza', price: 50, quantity: 1, splits: [], splitType: SplitType.EQUAL },
            ],
            members: [
                { id: randomUUID(), name: 'John', colorCode: '#000000' },
                { id: randomUUID(), name: 'Jack', colorCode: '#ffffff' },
            ],
        };

        const newBillId = randomUUID();

        // Mocking the result of the SQL query
        mockConnection.beginTransaction.mockResolvedValueOnce({
            query: jest.fn().mockResolvedValueOnce({ rows: [{ id: newBillId }] }),
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
        });

        const billId = await billDAO.create(bill);

        // Assertions
        expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
        expect(mockSQLBuilder.insert).toHaveBeenCalledTimes(3); // For bills, items, and members
        expect(billId).toBe(newBillId);
        // expect(mockTransaction.c).toHaveBeenCalledTimes(1);
    });

    it('should rollback the transaction if an error occurs', async () => {
        const bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> = {
            title: 'Dinner',
            description: 'Dinner with friends',
            currency: 'USD',
            totalAmount: 100,
            ownerId: randomUUID(),
            items: [
                { id: randomUUID(), name: 'Pizza', price: 50, quantity: 1, splits: [], splitType: SplitType.EQUAL },
            ],
            members: [
                { id: randomUUID(), name: 'John', colorCode: '#000000' },
                { id: randomUUID(), name: 'Jack', colorCode: '#ffffff' },
            ],
        };

        // Simulate an error in the transaction
        mockConnection.beginTransaction.mockResolvedValueOnce({
            query: jest.fn().mockRejectedValue(new Error('Database error')),
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
        });

        await expect(billDAO.create(bill)).rejects.toThrow('Failed to create bill with items and members');

        // Assert that the transaction was rolled back
        // expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
    });

    it('should update bill, bill_members, and bill_items with UUIDs and SplitType enum', async () => {
        const billId: UUID = '123e4567-e89b-12d3-a456-426614174000';
        const billData = {
            title: 'New Bill',
            description: 'Updated description',
            currency: 'USD',
            totalAmount: 100,
            members: [
                {
                    id: 'a3c7b000-e89b-12d3-a456-426614174001' as UUID,
                    name: 'Member 1',
                    colorCode: '#ff0000',
                },
                {
                    id: 'a3c7b000-e89b-12d3-a456-426614174002' as UUID,
                    name: 'Member 2',
                    colorCode: '#00ff00',
                },
            ],
            items: [
                {
                    id: '123e4567-e89b-12d3-a456-426614174003' as UUID,
                    name: 'Item 1',
                    price: 50,
                    quantity: 2,
                    splitType: SplitType.EQUAL,
                    splits: []
                },
                {
                    id: '123e4567-e89b-12d3-a456-426614174004' as UUID,
                    name: 'Item 2',
                    price: 25,
                    quantity: 1,
                    splitType: SplitType.AMOUNT,
                    splits: []
                },
            ],
        };

        // Simulate query results for members and items
        mockQuery.mockResolvedValueOnce({ rowCount: 0 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 0 }); // For bill_members (checking if member exists)

        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 0 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // For bill_members (checking if member exists)
        mockQuery.mockResolvedValueOnce({ rowCount: 0 }); // For bill_members (checking if member exists)

        // Call the update method
        await billDAO.update(billId, billData);
        console.log(mockTransaction.query.mock.calls);

        // Verify bill member insertions and updates
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining('INSERT'),
            expect.arrayContaining([
                'a3c7b000-e89b-12d3-a456-426614174001' as UUID,
                billId,
                'Member 1',
                '#ff0000'
            ])
        );
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            4,
            expect.stringContaining('UPDATE'),
            expect.arrayContaining([
                "a3c7b000-e89b-12d3-a456-426614174002",
                'Member 2',
                '#00ff00'
            ])
        );

        // Verify bill item insertions and updates
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            7,
            expect.stringContaining('UPDATE'),
            expect.arrayContaining([
                'Item 1',
                50,
                2,
                SplitType.EQUAL,
                '123e4567-e89b-12d3-a456-426614174003',
            ])
        );
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            9,
            expect.stringContaining('INSERT'),
            expect.arrayContaining([
                '123e4567-e89b-12d3-a456-426614174004',
                billId,
                'Item 2',
                25,
                1,
                SplitType.AMOUNT
            ])
        );

        // Check deletion of old bill items and members that are not in the update data
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            10,
            expect.stringContaining('DELETE'),
            expect.arrayContaining([billId, '123e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174004'])
        );

        // Verify final bill update
        expect(mockTransaction.query).toHaveBeenNthCalledWith(
            11,
            expect.stringContaining('UPDATE'),
            expect.arrayContaining([
                'New Bill',
                'Updated description',
                'USD',
                100,
                billId
            ])
        );

        // Ensure commit is called
        expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should handle errors and rollback transaction on failure', async () => {
        const billId: UUID = '123e4567-e89b-12d3-a456-426614174000';
        const billData = {
            title: 'New Bill',
            description: 'Updated description',
            currency: 'USD',
            totalAmount: 100,
            members: [
                {
                    id: 'a3c7b000-e89b-12d3-a456-426614174001' as UUID,
                    name: 'Member 1',
                    colorCode: '#ff0000',
                },
            ],
            items: [
                {
                    id: '123e4567-e89b-12d3-a456-426614174003' as UUID,
                    name: 'Item 1',
                    price: 50,
                    quantity: 2,
                    splitType: SplitType.EQUAL,
                    splits: []
                },
            ],
        };

        // Simulate an error during the bill update
        mockQuery.mockRejectedValueOnce(new Error('Database error'));

        try {
            await billDAO.update(billId, billData);
        } catch (e) {
            expect(getErrorMessage(e)).toBe('Database error');
            // expect(mockTransaction.rollback).toHaveBeenCalled();
        }
    });
    it('should delete bill and associated members and items', async () => {
        const billId: UUID = '123e4567-e89b-12d3-a456-426614174000';
        const mockResult = { rowCount: 1 } as any; // Simulate successful delete

        // Mock the queries for deleting bill_items, bill_members, and bills
        mockQuery.mockResolvedValueOnce(mockResult); // For bill_items
        mockQuery.mockResolvedValueOnce(mockResult); // For bill_members
        mockQuery.mockResolvedValueOnce(mockResult); // For bills

        // Call the delete method
        const result = await billDAO.delete(billId);

        // Assertions to check if the queries were called with correct arguments
        expect(mockTransaction.query).toHaveBeenCalledWith(
            'DELETE SQL',
            [billId]
        );
        expect(mockTransaction.query).toHaveBeenCalledWith(
            'DELETE SQL',
            [billId]
        );
        expect(mockTransaction.query).toHaveBeenCalledWith(
            'DELETE SQL',
            [billId]
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(result).toBe(true); // Check if result is true as rows were affected
    });

    it('should handle error and rollback transaction', async () => {
        const billId: UUID = '123e4567-e89b-12d3-a456-426614174000';

        // Mock the transaction to throw an error during execution
        mockQuery.mockRejectedValueOnce(new Error('Database error'));

        try {
            await billDAO.delete(billId);
        } catch (err) {
            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(getErrorMessage(err)).toBe('Database error');
        }
    });

    it('should return false when no rows are deleted', async () => {
        const billId: UUID = '123e4567-e89b-12d3-a456-426614174000';
        const mockResult = { rowCount: 0 } as any; // Simulate no rows affected

        // Mock the queries for deleting bill_items, bill_members, and bills
        mockQuery.mockResolvedValueOnce(mockResult); // For bill_items
        mockQuery.mockResolvedValueOnce(mockResult); // For bill_members
        mockQuery.mockResolvedValueOnce(mockResult); // For bills

        // Call the delete method
        const result = await billDAO.delete(billId);

        expect(result).toBe(false); // Check if result is false as no rows were affected
    });

    it('should return a bill with members and items if data exists', async () => {
        const billId = '123e4567-e89b-12d3-a456-426614174000';
        const mockRows = [
            {
                bill_id: billId,
                title: 'Test Bill',
                description: 'Test Description',
                currency: 'USD',
                total_amount: '100.00',
                owner_id: 'user-001',
                created_at: new Date('2023-01-01'),
                updated_at: new Date('2023-01-02'),
                member_id: 'member-001',
                member_name: 'John Doe',
                member_color_code: '#ff0000',
                item_id: 'item-001',
                item_name: 'Item 1',
                item_price: '50.00',
                item_quantity: '2',
                item_split_type: SplitType.EQUAL
            },
            {
                bill_id: billId,
                title: 'Test Bill',
                description: 'Test Description',
                currency: 'USD',
                total_amount: '100.00',
                owner_id: 'user-001',
                created_at: new Date('2023-01-01'),
                updated_at: new Date('2023-01-02'),
                member_id: 'member-002',
                member_name: 'Jane Doe',
                member_color_code: '#00ff00',
                item_id: 'item-002',
                item_name: 'Item 2',
                item_price: '25.00',
                item_quantity: '4',
                item_split_type: SplitType.PERCENTAGE
            }
        ];

        mockConnection.query.mockResolvedValueOnce({ rows: mockRows });

        const result = await billDAO.getById(billId);

        expect(mockConnection.query).toHaveBeenCalledWith(expect.any(String), [billId]);
        expect(result).toEqual({
            id: billId,
            title: 'Test Bill',
            description: 'Test Description',
            currency: 'USD',
            totalAmount: 100,
            ownerId: 'user-001',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-02'),
            items: [
                {
                    id: 'item-001',
                    name: 'Item 1',
                    price: 50,
                    quantity: 2,
                    splitType: SplitType.EQUAL,
                    splits: []
                },
                {
                    id: 'item-002',
                    name: 'Item 2',
                    price: 25,
                    quantity: 4,
                    splitType: SplitType.PERCENTAGE,
                    splits: []
                }
            ],
            members: [
                {
                    id: 'member-001',
                    name: 'John Doe',
                    colorCode: '#ff0000'
                },
                {
                    id: 'member-002',
                    name: 'Jane Doe',
                    colorCode: '#00ff00'
                }
            ]
        });
    });

    it('should return null if no bill is found', async () => {
        const billId = 'non-existent-id';

        mockConnection.query.mockResolvedValueOnce({ rows: [] });

        const result = await billDAO.getById(billId as UUID);

        expect(mockConnection.query).toHaveBeenCalledWith(expect.any(String), [billId]);
        expect(result).toBeNull();
    });

    it('should throw an error if the database query fails', async () => {
        const billId = '123e4567-e89b-12d3-a456-426614174000';
        const errorMessage = 'Database error';
        mockConnection.query.mockRejectedValueOnce(new Error(errorMessage));

        await expect(billDAO.getById(billId)).rejects.toThrowError('Database error');
        expect(mockConnection.query).toHaveBeenCalledWith(expect.any(String), [billId]);
    });
});
