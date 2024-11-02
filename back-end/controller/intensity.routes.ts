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
import express, { NextFunction, Request, Response } from 'express';
import intensityService from '../service/intensity.service';

const intensityRouter = express.Router();

intensityRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const intensities = await intensityService.getAllIntensities();
    res.status(200).json(intensities);
  } catch (error) {
    next(error);
  }
});

export { intensityRouter };