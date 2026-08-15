import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';
import { ApiResponse } from '@avbodh/typescript';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
import {RabbitMQClient} from '@avbodh/typescript'
import { QUEUE_URL } from './config/env';
const app = express();


app.use(express.json());
app.use(cookieParser());



// doing the connection of the rabbit MQ 
const rabbitMqString = String(QUEUE_URL)
export const appRabbitMQ = new RabbitMQClient(rabbitMqString)

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use('/auth', authRouter);

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
