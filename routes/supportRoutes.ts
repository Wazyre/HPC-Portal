import { Router } from "express";
import { getComments, getPendingTickets, getTicket, getTickets, postComment, submitTicket } from "../controllers/supportController.ts";

const router = Router();

router.get('/', getTickets);
router.get('/pending/:email', getPendingTickets);
router.get('/ticket/:id', getTicket);
router.post('/submit', submitTicket);
router.get('/comments/:ticketId', getComments);
router.post('/comment', postComment);

export default router;