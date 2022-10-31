const redis = require('redis');
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } = process.env;

const redisClient = redis.createClient({
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    },
    username: REDIS_USER,
    password: REDIS_PASSWORD
});

module.exports = { redisClient }