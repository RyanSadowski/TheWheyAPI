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
    console.log(req.decoded.id);
    userService.getHomeData(req.decoded.id).then(function (terd, werd) {
        return res.status(201).json({
            success: true,
            lifts: terd[0],
            workouts: terd[1],
            userData: terd[2],
            level: terd[3],
            journal: terd[4],
            inventory: terd[5]
        })
    })
});

module.exports = homeRoutes;