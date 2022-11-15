const { Client } = require('pg');
const { logger } = require('../helpers/logger');
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } = process.env;

const clientDatabase = new Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});

clientDatabase.connect(function (error) {
    if (error) throw error;
    logger.info("Successful connection to the database ");
});

module.exports = { clientDatabase };