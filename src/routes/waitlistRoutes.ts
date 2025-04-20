import express from "express";
import {
  joinWaitlist,
  getUserWaitlistEntries,
  removeFromWaitlist,
  getAllWaitlistEntries,
} from "../controllers/waitlistController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: Waitlist management endpoints
 */

/**
 * @swagger
 * /api/waitlist:
 *   post:
 *     summary: Join the waitlist
 *     tags: [Waitlist]
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
 *               - preferredDate
 *             properties:
 *               dentistId:
 *                 type: string
 *               preferredDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Added to waitlist successfully
 *       400:
 *         description: Already on waitlist for this dentist
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, joinWaitlist);

/**
 * @swagger
 * /api/waitlist/me:
 *   get:
 *     summary: Get user's waitlist entries
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's waitlist entries
 *       401:
 *         description: Not authorized
 */
router.get("/me", protect, getUserWaitlistEntries);

/**
 * @swagger
 * /api/waitlist/{id}:
 *   delete:
 *     summary: Remove from waitlist
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Waitlist entry ID
 *     responses:
 *       200:
 *         description: Removed from waitlist successfully
 *       404:
 *         description: Waitlist entry not found
 *       401:
 *         description: Not authorized
 */
router.delete("/:id", protect, removeFromWaitlist);

/**
 * @swagger
 * /api/waitlist:
 *   get:
 *     summary: Get all waitlist entries (admin only)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all waitlist entries
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.get("/", protect, admin, getAllWaitlistEntries);

export default router;
