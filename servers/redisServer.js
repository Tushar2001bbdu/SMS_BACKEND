const redis = require("redis");
async function intializeRedisClient()
{
    const redisClient = redis.createClient({
        url: "redis://localhost:3006",
      });
      async function connectToRedis() {
        await redisClient.connect();
      }
      
      connectToRedis();
      
      redisClient.on("connect", () => {
        console.log("Connected to Redis");
      });
      redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });
      return redisClient;
      
}
module.exports= intializeRedisClient
