import {
  REDIS_URL
} from "../config/env";
import { createClient, RedisClientType } from "redis";


class RedisConfig {

  public redisClient : RedisClientType ; 
  constructor() {

   
    
    this.redisClient = createClient({
      url: REDIS_URL,
      pingInterval: 1000 * 60 * 4, // 4 minutes
    });
   

    this.redisClient.on("error", (err: any) =>
      console.log(" Redis Client Error:", err),
    );
    this.redisClient.on("connect", () =>
      console.log("Redis Connected Successfully"),
    );
    
   
    this.connect();
    
  }

  private async connect() {
    try {
      await this.redisClient.connect();
     
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }
  
  
}

export const redisConfig = new RedisConfig();
export const redisClient = redisConfig.redisClient ; 