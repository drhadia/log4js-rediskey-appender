'use strict';
//@ts-check
const redis = require('redis');
const util = require('util');

function redisKeyAppender(config, layout) {
    const host = config.host || '127.0.0.1';
    const port = config.port || 6379;
    const auth = config.pass ? { auth_pass: config.pass } : {};
    const prefix = config.prefix || '';
    const redisUrl = config.redis_url || '';
    const expireTimeInSeconds = config.ttl || 0;

    let key = config.key || getCurrentDate();

    if (prefix) {
        key = 'logs_' + prefix + '_' + key;
    } else {
        key = 'logs_' + key;
    }

    let redisClient = null;
    if (redisUrl != '') {
        redisClient = redis.createClient({ url: redisClient });
    } else {
        redisClient = redis.createClient(port, host, auth);
    }
    redisClient.connect().catch(console.error);

    redisClient.on('error', (err) => {
        console.error(`log4js.redisAppender - ${host}:${port} Error: ${util.inspect(err)}`); // eslint-disable-line
    });

    const appender = function (loggingEvent) {
        redisClient.RPUSH(key, JSON.stringify(loggingEvent.data), (err, reply) => {
            if (err) {
                console.error(err);
                return;
            }

            if (expireTimeInSeconds > 0) {
                redisClient.EXPIRE(key, expireTimeInSeconds, (err, reply) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            }
        });
    };

    appender.shutdown = (cb) => {
        redisClient.quit();
        cb();
    };
    return appender;
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
}

module.exports.configure = redisKeyAppender;
