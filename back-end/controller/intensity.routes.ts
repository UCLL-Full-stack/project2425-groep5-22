/**
 * @swagger
 * components:
 *   schemas:
 *     Intensity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         intensity:
 *           type: string
 *           description: The intensity level name
 *         order:
 *           type: integer
 *           description: The display order of the intensity
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           readOnly: true
 */
import express, { NextFunction, Request, Response } from 'express';
import intensityService from '../service/intensity.service';
import { Role } from '../types';

const intensityRouter = express.Router();

/**
 * @swagger
 * /intensities:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all intensity levels
 *     responses:
 *       200:
 *         description: An array of intensity objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Intensity'
 */
intensityRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    const intensities = await intensityService.getAllIntensities();
    res.status(200).json(intensities);
  } catch (error) {
    next(error);
  }
});

export { intensityRouter };