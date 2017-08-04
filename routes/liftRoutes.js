var express = require('express'),
  liftRoutes = express.Router(),
  db = require('../db'),
  jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
  config = require('../config'), // get our config file
  userService = require('../userService'),
  bcrypt = require("bcrypt");

var app = express();

liftRoutes.post('/all', function (req, res) {
  db.query('SELECT * FROM liftlist', function (err, result) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "an error occured",
        error: err
      });
    } else {
      res.status(201).json({
        success: true,
        message: "all lifts",
        body: result.rows
      });
    }
  });
});

liftRoutes.post('/workouttypes', function (req, res) {
  db.query('SELECT * FROM workouttypes', function (err, result) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "an error occured",
        error: err
      });
    } else {
      res.status(201).json({
        success: true,
        message: "all workouts",
        body: result.rows
      });
    }
  });
});
//Unity sucks and I have to use a put request

liftRoutes.put('/workout', function (req, res) {
    //console.log(req.decoded.id);
    userService.saveWorkoutData(req.body, req.decoded.id).then(function (data, error) {
      // console.log(data);
        return res.status(201).json({
            success: true,
           pr: data[0],
           workout: data[1],
           xp: data[2]
        })
    })
});


module.exports = liftRoutes;
