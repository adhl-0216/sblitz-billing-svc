import { Request, Response } from 'express';
import { BillService } from '@/services/BillService';
import { UUID } from 'crypto';
import { SessionRequest } from 'supertokens-node/framework/express';

export class BillController {
    constructor(private billService: BillService) { }

    async createBill(req: SessionRequest, res: Response) {
        const userId = req.session!.getUserId()
        try {
            const bill = req.body
            const newBill = await this.billService.createBill(userId, bill);
            res.status(201).json(newBill);
        } catch (error) {
            console.error('Error creating bill:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllBillsByUserId(req: SessionRequest, res: Response) {
        const userId = req.session!.getUserId()
        try {
            const bills = await this.billService.getBillsByUserId(userId);
            res.json(bills);
        } catch (error) {
            console.error('Error fetching bills for user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getBillById(req: SessionRequest, res: Response) {
        const userId = req.session!.getUserId()
        try {
            const billId = req.params.billId as UUID
            const bill = await this.billService.getBillById(userId, billId);
            if (bill) {
                res.json(bill);
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateBill(req: SessionRequest, res: Response) {
        const userId = req.session!.getUserId()
        try {
            const billId = req.params.billId as UUID
            const updatedBill = await this.billService.updateBill(userId, billId, req.body);
            if (updatedBill) {
                res.json(updatedBill);
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteBill(req: SessionRequest, res: Response) {
        const userId = req.session!.getUserId()
        try {
            const billId = req.params.billId as UUID
            const result = await this.billService.deleteBill(userId, billId);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Bill not found' });
            }
        } catch (error) {
            console.error('Error deleting bill:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
