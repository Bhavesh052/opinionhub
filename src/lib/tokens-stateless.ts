import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET || "default_reset_secret";

export const generateStatelessResetToken = (email: string, otp: string) => {
    return jwt.sign({ email, otp }, SECRET, { expiresIn: "10m" });
};

export const verifyStatelessResetToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET) as { email: string; otp: string };
    } catch (error) {
        return null;
    }
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
