import { Router } from 'express';
import { BillControllerFactory } from '@/controllers/ControllerFactory';

const router = Router();

const billControllerFactory = new BillControllerFactory();
const connectionConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
}
const billController = billControllerFactory.createController(connectionConfig)

// Routes
router.get('/all-bills', (req, res, next) => billController.getAllBillsByUserId(req, res));
router.post('/create', (req, res, next) => billController.createBill(req, res));

router.get('/:billId', (req, res) => billController.getBillById(req, res));
router.put('/:billId', (req, res, next) => billController.updateBill(req, res));
router.delete('/:billId', (req, res, next) => billController.deleteBill(req, res));

export default router;
