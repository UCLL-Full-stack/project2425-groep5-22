/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *              description: JWT access token.
 *            email:
 *              type: string
 *              description: E-mail.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: E-mail.
 *            password:
 *              type: string
 *              description: User password.
 *      UserFull:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *            email:
 *              type: string
 *              description: E-mail.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      UserSimple:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            username:
 *              type: string
 *              description: User name.
 *            email:
 *              type: string
 *              description: E-mail.
 *      UserInput:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *            email:
 *              type: string
 *              description: E-mail.
 *            role:
 *               $ref: '#/components/schemas/Role'
 *      Role:
 *          type: string
 *          enum: [superadmin, admin, guest]
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { Role, UserInput } from '../types/index';

const userRouter = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the current user
 *     responses:
 *       200:
 *         description: The current user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { email: string; role: Role } };
        const { email, role } = request.auth;
        const user = await userService.getUserByEmail({ email });
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by username
 *     parameters:
 *          - in: path
 *            name: username
 *            schema:
 *              type: integer
 *              required: true
 *              description: The user username.
 *     responses:
 *       200:
 *         description: Get a user by username
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserFull'
 *                 - $ref: '#/components/schemas/UserSimple'
 */
userRouter.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { email: string; role: Role } };
        const { email, role } = request.auth;
        const user = await userService.getUserByUsername({ username: request.params.username, role });
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign a user up
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail.
 *               password:
 *                 type: string
 *                 description: User password.
 *     responses:
 *       200:
 *         description: The user's token and email 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.authenticate(userInput);
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
});

export { userRouter };
