import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma/client.js';
import { argon2id, hash, verify } from 'argon2';
import type { UserModel } from '../generated/prisma/models.ts';
import { generateToken, verifyToken } from '../utils/generateTokens.ts';

const prisma = new PrismaClient();

export const getUsers = () => {
    return;
};

export const getUser = expressAsyncHandler(async (req, res) => {
    await prisma.user.findUnique({
        where: {
            email: req.body.email,
        }
    }).then(async(user: UserModel | null) => {
        res.json(user);
    }).catch((err: any) => {
        res.status(400).json({userNotFound: "Can't find user", err});
    });
});

export const authorizeUser = expressAsyncHandler(async (req, res) => {
    await prisma.user.findUnique({
        where: {
            email: req.query.email!.toString(),
        }
    }).then(async(user: UserModel | null) => {
        const isMatch = await verify(user?.password!, req.query.password!.toString());
        if (isMatch) {
            const token = generateToken({id: user?.id!, role: user?.role!})
            res.json({...user, accessToken: token});
            
        } else {
            res.status(400).json({loginDetailsFailed: "Invalid Credentials."});
        }
    }).catch((err: any) => {
        console.error(err)
        res.status(400).json({loginDetailsFailed: "Invalid Credentials."});
    });

});

export const verifyUser = expressAsyncHandler(async (req, res) => {
    await verifyToken(req.headers.authorization!).then(async(decoded) => {
        await prisma.user.findUnique({
            where: {
                id: decoded!.data.id,
            }
        }).then(async(user: UserModel | null) => {
            res.json({...user, accessToken: decoded!.data.token});
        }).catch((err: any) => {
            res.status(400).json({userNotFound: "Can't find user", err});
        });
    })
});

export const changePassword = expressAsyncHandler(async (req, res) => {
    const newPassword = await hashPassword(req.body.password);

    await prisma.user.update({
        where: {
            email: req.body.email!
        },
        data: {
            password: newPassword!
        }
    }).then(async(user: UserModel) => {
        res.json(user);
    }).catch((err: any) => {
        console.error(err);
        res.status(400).json({err});
    });
})

const hashPassword = async(password: string) => {
    try {
        const storedHash = await hash(password, {
            type: argon2id, // Recommended type for general use
            memoryCost: 64000,     // Adjust memory usage (in KB)
            timeCost: 3,           // Adjust the number of iterations
            parallelism: 4,        // Adjust based on your CPU cores
        });
        return storedHash;
    } catch (err) {
        return err;
    }
};