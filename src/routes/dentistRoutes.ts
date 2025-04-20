import express from "express";
import {
  getAllDentists,
  getDentistById,
  createDentist,
  updateDentist,
  deleteDentist,
} from "../controllers/dentistController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dentists
 *   description: Dentist management endpoints
 */

/**
 * @swagger
 * /api/dentists:
 *   get:
 *     summary: Get all dentists
 *     tags: [Dentists]
 *     responses:
 *       200:
 *         description: List of dentists
 */
router.get("/", getAllDentists);

/**
 * @swagger
 * /api/dentists/{id}:
 *   get:
 *     summary: Get dentist by ID
 *     tags: [Dentists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dentist ID
 *     responses:
 *       200:
 *         description: Dentist details
 *       404:
 *         description: Dentist not found
 */
router.get("/:id", getDentistById);

/**
 * @swagger
 * /api/dentists:
 *   post:
 *     summary: Create a new dentist (admin only)
 *     tags: [Dentists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - yearsOfExperience
 *               - areaOfExpertise
 *             properties:
 *               name:
 *                 type: string
 *               yearsOfExperience:
 *                 type: number
 *               areaOfExpertise:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dentist created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.post("/", protect, admin, createDentist);

/**
 * @swagger
 * /api/dentists/{id}:
 *   put:
 *     summary: Update a dentist (admin only)
 *     tags: [Dentists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dentist ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               yearsOfExperience:
 *                 type: number
 *               areaOfExpertise:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dentist updated successfully
 *       404:
 *         description: Dentist not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.put("/:id", protect, admin, updateDentist);

/**
 * @swagger
 * /api/dentists/{id}:
 *   delete:
 *     summary: Delete a dentist (admin only)
 *     tags: [Dentists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dentist ID
 *     responses:
 *       200:
 *         description: Dentist deleted successfully
 *       404:
 *         description: Dentist not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as admin
 */
router.delete("/:id", protect, admin, deleteDentist);

export default router;
