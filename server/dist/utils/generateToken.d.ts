import jwt from "jsonwebtoken";
export declare const generateToken: (id: string, role: string) => string;
export declare const verifyToken: (token: string) => jwt.JwtPayload;
