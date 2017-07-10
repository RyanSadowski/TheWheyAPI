const pg                = require('pg');
const url               = require('url');
const config            = require('./config'); // get our config file

const params = url.parse(process.env.DATABASE_URL || config.database );
const auth = params.auth.split(':');

const dbConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1]
};

const pool = new pg.Pool(dbConfig);


module.exports.query = function (text, values, callback){
  console.log('query:', text, values);
  return pool.query(text, values, callback);
}

module.exports.connect = function (callback){
  return pool.connect(callback);
}

pool.on('connect', function() {
  console.log("client made!");
})
