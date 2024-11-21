import { Request, Response } from 'express';
import { BillService } from '@/services/BillService';

export class BillController {
    constructor(private billService: BillService) { }

    // async getAllBills(req: Request, res: Response) {
    //     try {
    //         const bills = await this.billService.getAllBills();
    //         res.json(bills);
    //     } catch (error) {
    //         console.error('Error fetching bills:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // }

    async getAllBillsByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const bills = await this.billService.getBillsByUserId(userId);
            res.json(bills);
        } catch (error) {
            console.error('Error fetching bills for user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createBill(req: Request, res: Response) {
        try {
            const newBill = await this.billService.createBill(req.body);
            res.status(201).json(newBill);
        } catch (error) {
            console.error('Error creating bill:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getBillById(req: Request, res: Response) {
        try {
            const bill = await this.billService.getBillById(req.params.billId);
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

    async updateBill(req: Request, res: Response) {
        try {
            const updatedBill = await this.billService.updateBill(req.params.billId, req.body);
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

    async deleteBill(req: Request, res: Response) {
        try {
            const result = await this.billService.deleteBill(req.params.billId);
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
