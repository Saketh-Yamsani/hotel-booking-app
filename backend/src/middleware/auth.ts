import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Mark it as optional to avoid TypeScript errors
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token; // Use optional chaining

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // Stop execution
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    req.userId = decoded.userId; // Assign userId to request object
    next(); // Call next() to continue
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return; // Stop execution
  }
};

export default verifyToken;
