import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';
import { ApiResponse } from '@avbodh/typescript';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
import {RabbitMQClient} from '@avbodh/typescript'
import { QUEUE_URL } from './config/env';
const app = express();


app.use(express.json());
app.use(cookieParser());



// Import the RabbitMQ client from its dedicated file to avoid circular dependencies
import { appRabbitMQ } from './rabbitmq/client';
import { internalAuthMiddleware } from './middlewares/internalAuth.middleware';

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

// Protect all auth routes from direct access
app.use('/auth', internalAuthMiddleware, authRouter);

app.get("/health" , (req , res) => {
    res.status(200).json(
        new ApiResponse(
            "Server is running properly"
        )
    )
})

async function startServer() {
    // Await the connection inside an async function
    await appRabbitMQ.connect();
    
    app.listen(port, host, () => {
        console.log(`[ ready ] http://${host}:${port}`);
    });
}

startServer();
