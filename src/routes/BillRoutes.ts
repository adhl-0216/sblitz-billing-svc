import { Router } from 'express';
import { BillControllerFactory } from '@/controllers/ControllerFactory';

const router = Router();

const billControllerFactory = new BillControllerFactory();
const billController = billControllerFactory.createController()

// Routes
router.get('/all-bills', (req, res, next) => billController.getAllBillsByUserId(req, res));
router.post('/create', (req, res, next) => billController.createBill(req, res));

router.get('/:billId', (req, res, next) => billController.getBillById(req, res));
router.put('/:billId', (req, res, next) => billController.updateBill(req, res));
router.delete('/:billId', (req, res, next) => billController.deleteBill(req, res));

export default router;
