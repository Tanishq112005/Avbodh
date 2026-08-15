import express from 'express';
import { HOST, PORT, QUEUE_URL } from './config/env';
import { ApiResponse, RabbitMQClient } from '@avbodh/typescript';
const host = String(HOST || "");
const port = parseInt(PORT || "3000") ;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});



const apiKey = String(QUEUE_URL)
export const rabbitMqClient = new RabbitMQClient(apiKey)


// healht running endpoint 
app.get("/health" , (req , res) => {
  res.status(200).json(
    new ApiResponse(
      "Server is running properly"
    )
  )
})




import { startEmailConsumer } from './queue/consumer';

async function startServer() {
    // 1. Await the RabbitMQ connection inside the async function
    await rabbitMqClient.connect();
    
    // 2. Start the consumer listening for emails
    await startEmailConsumer();
    
    app.listen(port, host, () => {
        console.log(`[ ready ] http://${host}:${port}`);
    });
}
