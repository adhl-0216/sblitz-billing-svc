import { Request, Response } from 'express';
import { BillService } from '@/services/BillService';
import { UUID } from 'crypto';
import { getUserId } from '@/util';

export class BillController {
    constructor(private billService: BillService) { }

    private errorHandler(res: Response, error: Error) {
        if (error.message === 'UserId not found in request headers') {
            res.status(400).json({ error: 'Bad request: userId is required' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createBill(req: Request, res: Response) {
        try {
            const userId = getUserId(req);
            const bill = req.body;
            const newBill = await this.billService.createBill(userId, bill);
            res.status(201).json(newBill);
        } catch (error) {
            console.error('Error creating bill:', error);
            this.errorHandler(res, error as Error);
        }
    }

    async getAllBillsByUserId(req: Request, res: Response) {
        try {
            const userId = getUserId(req);
            const bills = await this.billService.getBillsByUserId(userId);
            res.json(bills);
        } catch (error) {
            console.error('Error fetching bills for user:', error);
            this.errorHandler(res, error as Error);
        }
    }

    async getBillById(req: Request, res: Response) {
        try {
            const userId = getUserId(req);
            const billId = req.params.billId as UUID;
            const bill = await this.billService.getBillById(userId, billId);
            if (bill) {
                res.json(bill);
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
            this.errorHandler(res, error as Error);
        }
    }

    async updateBill(req: Request, res: Response) {
        try {
            const userId = getUserId(req);
            const billId = req.params.billId as UUID;
            const updatedBill = await this.billService.updateBill(userId, billId, req.body);
            if (updatedBill) {
                res.json(updatedBill);
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            this.errorHandler(res, error as Error);
        }
    }

    async deleteBill(req: Request, res: Response) {
        try {
            const userId = getUserId(req);
            const billId = req.params.billId as UUID;
            const result = await this.billService.deleteBill(userId, billId);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error deleting bill:', error);
            this.errorHandler(res, error as Error);
        }
    }
}
