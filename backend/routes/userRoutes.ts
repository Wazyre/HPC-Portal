import { Router } from "express";
import { authorizeUser, changePassword, getUser, getUsers, verifyUser } from "../controllers/userController.ts";

const router = Router();

router.get('/', getUsers);
router.get('/user', getUser);
router.get('/login', authorizeUser);
router.get('/verify', verifyUser);
router.post('/editPassword', changePassword);

export default router;