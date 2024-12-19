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
 *         username:
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
import { GameInput, Role } from '../types';

const gameRouter = express.Router();

/**
 * @swagger
 * /games:
 *   get:
 *     security:
 *       - bearerAuth: []
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
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/random:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a random list of games
 *     responses:
 *       200:
 *         description: An array of game objects in random order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
gameRouter.get('/random', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games = await gameService.getGamesRandom();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/filter:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of games filtered by criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               intensityId:
 *                 type: number
 *               groups:
 *                 type: boolean
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: An array of filtered game objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
gameRouter.post('/filter', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.body;
    const games = await gameService.getFilteredGames(filters);
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a game
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The game id.
 *     responses:
 *       200:
 *         description: The game objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    const games = await gameService.getGame({
      id: Number(request.params.id)
    });
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/username/{username}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get games by user username
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user whose games you want to retrieve.
 *     responses:
 *       200:
 *         description: The list of games associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
gameRouter.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;

    const games = await gameService.getUserGames(request.params.username);
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /games:
 *   post:
 *     security:
 *       - bearerAuth: []
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
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    const gameInput = <GameInput>req.body;
    const response = await gameService.createGame(gameInput);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a game
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The game id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: The updated game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
gameRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    const gameInput = <GameInput>req.body;
    const response = await gameService.updateGame({ ...gameInput, gameId: Number(request.params.id), email, role });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a game
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *              required: true
 *              description: The game id.
 *     responses:
 *       204
 */
gameRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req as Request & { auth: { email: string; role: Role } };
    const { email, role } = request.auth;
    await gameService.deleteGame({ gameId: Number(request.params.id), email, role });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});


export { gameRouter };
