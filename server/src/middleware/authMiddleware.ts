import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded["id"] as string, role: decoded["role"] as string };
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
    return;
  }
  next();
};
