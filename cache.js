const redis = require("redis");
const { promisify } = require('util');

const client = redis.createClient({
  host: process.env.AUTHENTICATION_REDIS_HOST,
  port: process.env.AUTHENTICATION_REDIS_PORT,
  password: process.env.AUTHENTICATION_REDIS_PASSWORD
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  store: ({result, domain, token}) => (
    setAsync(`${domain}:${token}`, result, 'EX', process.env.AUTHENTICATION_EXPIRY_TIMOUT)
  ),
  retrieve: ({domain, token}) => getAsync(`${domain}:${token}`).then(result => result && JSON.parse(result))
}
