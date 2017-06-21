var express       = require('express'),
liftRoutes        = express.Router(),
db                = require('../db'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
bcrypt            = require("bcrypt");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);


module.exports = liftRoutes;
