import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "readysip_secret";
const JWT_EXPIRY = process.env["JWT_ACCESS_EXPIRY"] || "7d";

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
};
