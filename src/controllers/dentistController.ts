import { Request, Response } from "express";
import Dentist from "../models/Dentist";

// Get all dentists
export const getAllDentists = async (req: Request, res: Response) => {
  try {
    const dentists = await Dentist.find({}).sort({ name: 1 });
    res.json(dentists);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get dentist by ID
export const getDentistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dentist = await Dentist.findById(id);

    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    res.json(dentist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create dentist
export const createDentist = async (req: Request, res: Response) => {
  try {
    const { name, yearsOfExperience, areaOfExpertise } = req.body;

    const dentist = await Dentist.create({
      name,
      yearsOfExperience,
      areaOfExpertise,
    });

    res.status(201).json(dentist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update dentist
export const updateDentist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, yearsOfExperience, areaOfExpertise } = req.body;

    const dentist = await Dentist.findById(id);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    if (name) dentist.name = name;
    if (yearsOfExperience !== undefined) dentist.yearsOfExperience = yearsOfExperience;
    if (areaOfExpertise) dentist.areaOfExpertise = areaOfExpertise;

    await dentist.save();

    res.json(dentist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete dentist
export const deleteDentist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dentist = await Dentist.findById(id);
    if (!dentist) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    await dentist.deleteOne();

    res.json({ message: "Dentist deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
