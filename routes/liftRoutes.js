var express       = require('express'),
liftRoutes        = express.Router(),
db                = require('../db'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
bcrypt            = require("bcrypt");
var app = express();

liftRoutes.get('/all', function(req, res) {
  db.query('SELECT * FROM liftlist', function(err, result){
    if(err){
      //error
      return res.status(500).json({
        title: "an error occured",
        error: err
      });
    }else{
      res.status(201).json({
        success: true,
        message: "all lifts",
        body: result.rows
      });
    }
  });
});

liftRoutes.post('/workout', function(req, res){
  db.query("INSERT INTO workoutlog(user_id, type_id, distance, duration, name, description, start, finish, location ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
  [req.body.user_id, req.body.type_id, req.body.distance, req.body.duration, req.body.name, req.body.description, req.body.start, req.body.finish, req.body.location],
  function(err, result){
    if(err){
      console.error("error saving workout ", req.body.name)
      return res.status(500).json({
        title: "an error occured",
        error: err
      });
    }else{
      for(var i in req.body.lifts){
        db.query("INSERT INTO liftjournal(workoutlog_id, lift_id, sets, reps, weight, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [result.rows[0].id, req.body.lifts[i].lift_id, req.body.lifts[i].sets, req.body.lifts[i].reps, req.body.lifts[i].weight,
        req.body.lifts[i].notes],
        function(err, result){
          if(err){
            console.error("error saving workout in lifts ", req.body.name)
            return res.status(500).json({
              title: "an error occured",
              error: err
            });
          }
        });
      }
      return res.status(201).json({
        success: true,
        body: "workout registered"
      });
    }
  });
});

module.exports = liftRoutes;
