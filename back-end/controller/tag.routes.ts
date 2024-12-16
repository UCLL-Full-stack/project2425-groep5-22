/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           readOnly: true
 *         tag:
 *           type: string
 *           description: The tag name
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
import tagService from '../service/tag.service';
import { Role } from '../types';

// Custom type that extends the basic Request to fix type errors
interface AuthenticatedRequest extends Request {
  auth?: {
    email: string;
    role: Role;
  };
}

const tagRouter = express.Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all tags
 *     responses:
 *       200:
 *         description: An array of tag objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
tagRouter.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.auth || {};
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
});

export { tagRouter };