var express = require('express'),
  db = require('../db'),
  homeRoutes = express.Router(),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('../config'), // get our config file
  userService = require('../userService'),
  bcrypt = require("bcrypt");

var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

homeRoutes.post('/', function (req, res) {
    //console.log(req.decoded.id);
    userService.getHomeData(req.decoded.id).then(function (data, error) {
        return res.status(201).json({
            success: true,
            lifts: data[0],
            workouts: data[1],
            userData: data[2],
            level: data[3],
            journal: data[4],
            inventory: data[5]
        })
    })
});

module.exports = homeRoutes;