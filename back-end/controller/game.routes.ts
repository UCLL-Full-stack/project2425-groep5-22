/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
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
 *     Game:
 *       type: object
 *       required:
 *         - user
 *         - intensity
 *         - name
 *         - groups
 *         - duration
 *         - explanation
 *         - tags
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           readOnly: true
 *         user:
 *           $ref: '#/components/schemas/User'
 *         intensity:
 *           $ref: '#/components/schemas/Intensity'
 *         name:
 *           type: string
 *           description: Game name
 *         groups:
 *           type: boolean
 *           description: Indicates if the game has groups
 *         duration:
 *           type: integer
 *           description: Duration of the game in minutes
 *         explanation:
 *           type: string
 *           description: Explanation of the game
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           readOnly: true
 *     GameInput:
 *       type: object
 *       required:
 *         - user
 *         - intensity
 *         - name
 *         - groups
 *         - duration
 *         - explanation
 *         - tags
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         intensity:
 *           $ref: '#/components/schemas/Intensity'
 *         name:
 *           type: string
 *           minLength: 1
 *         groups:
 *           type: boolean
 *         duration:
 *           type: integer
 *           minimum: 1
 *         explanation:
 *           type: string
 *           minLength: 1
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */
import express, { NextFunction, Request, Response } from 'express';
import gameService from '../service/game.service';
import { GameInput } from '../types';

const gameRouter = express.Router();

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: The created game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
gameRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameInput = <GameInput>req.body;
    const response = await gameService.createGame(gameInput);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get a list of all the games
 *     responses:
 *       200:
 *         description: An array of game objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
gameRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The game id
 *     responses:
 *       200:
 *         description: A game object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const game = await gameService.getGameById(Number(req.params.id));
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
});

export { gameRouter };
