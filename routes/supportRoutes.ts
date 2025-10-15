import { Router } from "express";
import { getPendingTickets, getTicket, getTickets, submitTicket } from "../controllers/supportController.ts";

const router = Router();

router.get('/', getTickets);
router.get('/pending/:email', getPendingTickets);
router.get('/ticket/:id', getTicket);
router.post('/submit', submitTicket);

export default router;