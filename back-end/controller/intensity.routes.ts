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
 *         games:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Game'
 *           readOnly: true
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

const intensityRouter = express.Router();

/**
 * @swagger
 * /intensities:
 *   get:
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
    const intensities = await intensityService.getAllIntensities();
    res.status(200).json(intensities);
  } catch (error) {
    next(error);
  }
});

export { intensityRouter };