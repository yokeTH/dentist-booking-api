import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Booking from "../models/Booking";
import Waitlist from "../models/Waitlist";
import mongoose from "mongoose";

// Create a booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { dentistId, appointmentDate } = req.body;

    // Check if user already has a booking
    const existingBooking = await Booking.findOne({ user: req.user._id });
    if (existingBooking) {
      return res.status(400).json({ message: "You already have a booking. Please edit or delete it first." });
    }

    // Check if date is in the future
    const bookingDate = new Date(appointmentDate);
    if (bookingDate <= new Date()) {
      return res.status(400).json({ message: "Appointment date must be in the future" });
    }

    // Create new booking
    const booking = await Booking.create({
      user: req.user._id,
      dentist: dentistId,
      appointmentDate: bookingDate,
    });

    await booking.populate("dentist");

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's booking
export const getUserBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const booking = await Booking.findOne({ user: req.user._id }).populate(
      "dentist",
      "name yearsOfExperience areaOfExpertise",
    );

    if (!booking) {
      return res.status(404).json({ message: "No booking found" });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user's booking
export const updateUserBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { dentistId, appointmentDate } = req.body;

    // Find user's booking
    const booking = await Booking.findOne({ user: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: "No booking found" });
    }

    // Check if within 24 hour deadline
    const currentDate = new Date();
    const bookingDate = new Date(booking.appointmentDate);
    const hoursLeft = (bookingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    if (hoursLeft < 24) {
      return res.status(400).json({
        message: "Bookings can only be modified at least 24 hours before the appointment",
      });
    }

    // Update booking
    if (dentistId) booking.dentist = new mongoose.Types.ObjectId(dentistId);
    if (appointmentDate) booking.appointmentDate = new Date(appointmentDate);

    await booking.save();
    await booking.populate("dentist");

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user's booking
export const deleteUserBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Find user's booking
    const booking = await Booking.findOne({ user: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: "No booking found" });
    }

    // Check if within 24 hour deadline
    const currentDate = new Date();
    const bookingDate = new Date(booking.appointmentDate);
    const hoursLeft = (bookingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    if (hoursLeft < 24) {
      return res.status(400).json({
        message: "Bookings can only be canceled at least 24 hours before the appointment",
      });
    }

    await booking.deleteOne();

    // Check waitlist for this dentist and date and notify
    await checkWaitlist(booking.dentist, booking.appointmentDate);

    res.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email phone")
      .populate("dentist", "name yearsOfExperience areaOfExpertise")
      .sort({ appointmentDate: 1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update any booking
export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { dentistId, appointmentDate, userId } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking fields
    if (dentistId) booking.dentist = new mongoose.Types.ObjectId(dentistId);
    if (appointmentDate) booking.appointmentDate = new Date(appointmentDate);
    if (userId) booking.user = new mongoose.Types.ObjectId(userId);

    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate("user", "name email phone")
      .populate("dentist", "name yearsOfExperience areaOfExpertise");

    res.json(updatedBooking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete any booking
export const deleteBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();

    // Check waitlist for this dentist and date and notify
    await checkWaitlist(booking.dentist, booking.appointmentDate);

    res.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to check waitlist and notify users
const checkWaitlist = async (dentistId: mongoose.Types.ObjectId, date: Date) => {
  // Find all waitlist entries for this dentist
  const waitlistEntries = await Waitlist.find({
    dentist: dentistId,
    notified: false,
  }).populate("user");

  // Find the closest matching entry by date
  if (waitlistEntries.length > 0) {
    // Sort by date difference
    waitlistEntries.sort((a, b) => {
      const diffA = Math.abs(a.preferredDate.getTime() - date.getTime());
      const diffB = Math.abs(b.preferredDate.getTime() - date.getTime());
      return diffA - diffB;
    });

    // Notify the closest match
    const closestEntry = waitlistEntries[0];
    closestEntry.notified = true;
    await closestEntry.save();

    // In a real app, send an email or notification to the user
    console.log(`Notifying user ${closestEntry.user} about available slot`);
  }
};
