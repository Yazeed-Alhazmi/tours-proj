// import { createClient } from "redis";
const {createClient} = require('redis');


const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;