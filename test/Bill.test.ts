import { Bill } from '../models/Bill';
import { BillDAO } from '../dao/BillDAO';
import { Member } from '../models/Member';
import { Item } from '../models/Item';

jest.mock('../dao/BillDAO');
jest.mock('../models/Member');
jest.mock('../models/Item');

describe('Bill Class', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new bill and return its ID', async () => {
            // Arrange
            const title = 'Dinner';
            const description = 'Dinner with friends';
            const ownerId = 'user-123';
            const billId = 'bill-456';
            (BillDAO.create as jest.Mock).mockResolvedValue(billId);

            // Act
            const result = await Bill.create(title, description, ownerId);

            // Assert
            expect(result).toBe(billId);
            expect(BillDAO.create).toHaveBeenCalledWith(title, description, ownerId, expect.any(Date), expect.any(Date));
        });
    });

    describe('addMember', () => {
        it('should add a member to the bill', async () => {
            // Arrange
            const billId = 'bill-456';
            const userId = 'user-123';

            // Act
            await Bill.addMember(billId, userId);

            // Assert
            expect(Member.joinBill).toHaveBeenCalledWith(userId, billId);
        });
    });

    describe('addItem', () => {
        it('should add an item to the bill', async () => {
            // Arrange
            const billId = 'bill-456';
            const name = 'Pizza';
            const description = 'Delicious cheese pizza';
            const price = 12.99;
            const quantity = 2;

            // Act
            await Bill.addItem(billId, name, description, price, quantity);

            // Assert
            expect(Item.addToBill).toHaveBeenCalledWith(billId, { name, description, price, quantity });
        });
    });

    describe('getTotalPrice', () => {
        it('should return the total price of the bill', async () => {
            // Arrange
            const billId = 'bill-456';
            const billData = { items: [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }] };
            const expectedTotal = 25;

            // Mock the BillDAO response
            (BillDAO.getBillById as jest.Mock).mockResolvedValue(billData);

            // Act
            const total = await Bill.getTotalPrice(billId);

            // Assert
            expect(total).toBe(expectedTotal);
            expect(BillDAO.getBillById).toHaveBeenCalledWith(billId);
        });
    });
});
