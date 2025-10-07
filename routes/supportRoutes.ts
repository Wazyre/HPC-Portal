import { Router } from "express";
import { getTicket, getTickets, submitTicket } from "../controllers/supportController.ts";

const router = Router();

router.get('/', getTickets);
router.get('/:id', getTicket);
router.post('/submit', submitTicket);

export default router;