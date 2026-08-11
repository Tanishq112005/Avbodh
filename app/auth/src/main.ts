import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});


import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

app.get("/health" , (req , res) => {
    res.send({
        'message' : "Server is Running Properly"
    })
})


app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
