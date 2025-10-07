import jwt from "jsonwebtoken";
import authConfig from "../config/authConfig.ts";

interface tokenUser {
    id: number,
    role: string
}

export const generateToken = (user: tokenUser) => {
    try {
        const token = jwt.sign(
            user,
            authConfig.secret,
            {expiresIn: authConfig.secretExpiresIn as any}
        )
        return token;
    } catch (err) {
        return "Error in user: " + err;
    }
};

export const refreshToken = (user: tokenUser) => {
    try {
        const token = jwt.sign(
            user,
            authConfig.refreshSecret,
            {expiresIn: authConfig.refreshSecretExpiresIn as any}
        )
        return token;
    } catch (err) {
        return "Error in user: " + err;
    }
}

export const verifyToken = async(token: string) => {
    try {
        const decode = jwt.verify(token, authConfig.secret)
        return {login: true, data: {...decode as tokenUser, token: token}}
    } catch (err) {
        console.error("Invalid token: " + err);
    }
}