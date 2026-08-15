import express from 'express';
import { HOST, PORT } from './config/env';
import { ApiResponse } from '@avbodh/typescript';
const host = String(HOST || "");
const port = parseInt(PORT || "3000") ;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});



// healht running endpoint 
app.get("/health" , (req , res) => {
  res.status(200).json(
    new ApiResponse(
      "Server is running properly"
    )
  )
})



app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
