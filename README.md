## Installation

Install with npm

```bash
npm install log4js
npm i log4js-rediskey-appender
```

## Configuration

* `type` - `redis`
* `host` - `string` (optional, defaults to `127.0.0.1`) - the location of the redis server
* `port` - `integer` (optional, defaults to `6379`) - the port the redis server is listening on
* `pass` - `string` (optional) - password to use when authenticating connection to redis
* `key` - `string` (optional) - key will be used to save logs in redis, if keys is not provided then current date will consider as key in format of `YYYY_MM_DD`
* `prefix` - `string` (optional) - prefix will be append with provide key
* `ttl` - `string` (optional) - seconds to expire key
* `redis_url` - `string` (optional) - example `redis://myuser:mypassword@127.0.0.1:6379)` if provided, then ignore host, port and pass configuration

## Example

```javascript
log4js.configure({
  appenders: {
        redis: {
            type: 'log4js-rediskey-appender',
            prefix: 'myprefix',
            ttl: 604800, //7 Days
            redis_url: 'redis://myuser:mypassword@127.0.0.1:6379'
        }
    },
    categories: { default: { appenders: ['redis'], level: 'debug' } }
});
```

This configuration will append message using RPUSH with key `logs_myprefix_2024_05_18` on `127.0.0.1:6379`.