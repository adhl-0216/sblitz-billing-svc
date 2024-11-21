import { Router } from 'express';
import { BillController } from '@/controllers/BillController';
import { BillService } from '@/services/BillService';
import { BillDAO } from '@/dao/BillDAO';
import { createDatabaseFactory } from '@/db/Factory';

const router = Router();

// Setup
const databaseFactory = createDatabaseFactory('postgres');
const billDAO = new BillDAO(databaseFactory, {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
});
const billService = new BillService(billDAO);
const billController = new BillController(billService);

// Routes
router.get('/', (req, res) => billController.getAllBills(req, res));
router.post('/', (req, res) => billController.createBill(req, res));

router.get('/:billId', (req, res) => billController.getBillById(req, res));
router.put('/:billId', (req, res) => billController.updateBill(req, res));
router.delete('/:billId', (req, res) => billController.deleteBill(req, res));

export default router;
