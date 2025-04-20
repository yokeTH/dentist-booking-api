import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Waitlist from "../models/Waitlist";

// Join waitlist
export const joinWaitlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { dentistId, preferredDate } = req.body;

    // Check if user is already on waitlist for this dentist
    const existingEntry = await Waitlist.findOne({
      user: req.user._id,
      dentist: dentistId,
      notified: false,
    });

    if (existingEntry) {
      return res.status(400).json({
        message: "You are already on the waitlist for this dentist",
      });
    }

    const waitlistEntry = await Waitlist.create({
      user: req.user._id,
      dentist: dentistId,
      preferredDate: new Date(preferredDate),
    });

    await waitlistEntry.populate("dentist");

    res.status(201).json(waitlistEntry);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's waitlist entries
export const getUserWaitlistEntries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const waitlistEntries = await Waitlist.find({
      user: req.user._id,
      notified: false,
    }).populate("dentist");

    res.json(waitlistEntries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from waitlist
export const removeFromWaitlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    const waitlistEntry = await Waitlist.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!waitlistEntry) {
      return res.status(404).json({ message: "Waitlist entry not found" });
    }

    await waitlistEntry.deleteOne();

    res.json({ message: "Removed from waitlist successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all waitlist entries
export const getAllWaitlistEntries = async (req: AuthRequest, res: Response) => {
  try {
    const waitlistEntries = await Waitlist.find({})
      .populate("user", "name email phone")
      .populate("dentist", "name yearsOfExperience areaOfExpertise")
      .sort({ createdAt: 1 });

    res.json(waitlistEntries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
