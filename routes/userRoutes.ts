import { Router } from "express";
import { authorizeUser, changePassword, getUser, getUsers, ssoLogin, verifyUser } from "../controllers/userController.ts";

const router = Router();

router.get('/', getUsers);
router.get('/user/:username', getUser);
router.get('/login', authorizeUser);
router.get('/sso-login', ssoLogin);
router.get('/verify', verifyUser);
router.post('/editPassword', changePassword);

export default router;