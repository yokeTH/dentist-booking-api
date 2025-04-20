import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// Generate JWT
const generateToken = (id: string): string => {
  const payload = { id };
  const secret = process.env.JWT_SECRET || "default_secret";
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "30d") as `${number}${"d" | "h" | "m" | "s"}`,
  };

  return jwt.sign(payload, secret, options);
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Logout user (clear cookie if using cookies)
export const logout = (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};

// Deactivate account
export const deactivateAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: "Account deactivated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
