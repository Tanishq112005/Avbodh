import { RabbitMQClient } from '@avbodh/typescript';
import { QUEUE_URL } from '../config/env';

// doing the connection of the rabbit MQ
const rabbitMqString = String(QUEUE_URL);
export const appRabbitMQ = new RabbitMQClient(rabbitMqString);
