import { Router } from 'express';
import { BillControllerFactory } from '@/controllers/ControllerFactory';

const router = Router();

const billControllerFactory = new BillControllerFactory();
const billController = billControllerFactory.createController()


// Routes
router.get('/all-bills', (req, res) => billController.getAllBillsByUserId(req, res));
router.post('/create', (req, res) => billController.createBill(req, res));

router.get('/:billId', (req, res) => billController.getBillById(req, res));
router.put('/:billId', (req, res) => billController.updateBill(req, res));
router.delete('/:billId', (req, res) => billController.deleteBill(req, res));

export default router;
