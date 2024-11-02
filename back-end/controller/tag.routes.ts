/**
 * @swagger
 * /tags:
 *   get:
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
import express, { NextFunction, Request, Response } from 'express';
import tagService from '../service/tag.service';

const tagRouter = express.Router();

tagRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
});

export { tagRouter };