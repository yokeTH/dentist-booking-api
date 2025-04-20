import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    phone: "1234567890",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    isActive: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "0987654321",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    isActive: true,
  },
];

export const dentists = [
  {
    name: "Dr. Sarah Johnson",
    yearsOfExperience: 12,
    areaOfExpertise: "General Dentistry",
  },
  {
    name: "Dr. Michael Chen",
    yearsOfExperience: 8,
    areaOfExpertise: "Orthodontics",
  },
  {
    name: "Dr. Lisa Smith",
    yearsOfExperience: 15,
    areaOfExpertise: "Periodontics",
  },
  {
    name: "Dr. Robert Williams",
    yearsOfExperience: 10,
    areaOfExpertise: "Endodontics",
  },
];
