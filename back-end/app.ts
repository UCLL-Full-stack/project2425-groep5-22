import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { gameRouter } from './controller/game.routes';
import { tagRouter } from './controller/tag.routes';
import { intensityRouter } from './controller/intensity.routes';
import { expressjwt } from 'express-jwt';
import { userRouter } from './controller/user.routes';
import helmet from 'helmet';

const app = express();
app.use(helmet());

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status']
    })
);

app.use('/games', gameRouter);
app.use('/tags', tagRouter);
app.use('/intensities', intensityRouter);
app.use('/users', userRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Jeugdwerk API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = "An unknown error occurred.";
    if (err instanceof Error) {
        message = err.message
    }

    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
        return;
    }

    res.status(400).json({ status: 'application error', message: err.message })
})

app.listen(port || 3000, () => {
    console.log(`Back-end is running: http://localhost:${port}.`);
});
