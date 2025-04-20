import express from "express";
import {
  createBooking,
  getUserBooking,
  updateUserBooking,
  deleteUserBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dentistId
 *               - appointmentDate
 *             properties:
 *               dentistId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: User already has a booking or invalid input
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, createBooking);

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Get user's booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's booking
 *       404:
 *         description: No booking found
 *       401:
 *         description: Not authorized
 */
router.get("/me", protect, getUserBooking);

/**
 * @swagger
 * /api/bookings/me:
 *   put:
 *     summary: Update user's booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dentistId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Changes must be made at least 24 hours before appointment
 *       404:
 *         description: No booking found
 *       401:
 *         description: Not authorized
 */
router.put("/me", protect, updateUserBooking);

/**
 * @swagger
 * /api/bookings/me:
 *   delete:
 *     summary: Delete user's booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       400:
 *         description: Booking can only be canceled at least 24 hours before appointment
 *       404:
 *         description: No booking found
 *       401:
 *         description: Not authorized
 */
router.delete("/me", protect, deleteUserBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get("/", protect, admin, getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update any booking (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dentistId:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.put("/:id", protect, admin, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete any booking (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.delete("/:id", protect, admin, deleteBooking);

export default router;
