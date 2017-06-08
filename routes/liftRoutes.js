var express       = require('express'),
liftRoutes        = express.Router(),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
bcrypt            = require("bcrypt"),
Lift              = require("../models/lift");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

liftRoutes.get('/all', function(req, res) {
  Lift.find({}, function(err, lifts) {
    res.json(lifts);
  });
});

liftRoutes.post('/', function(req, res){
  var lift = new Lift({
    name: req.body.name,
    desc: req.body.desc,
    muscleGroup:eq.body.muscleGroup
  });
  lift.save(function(err,result){
    if(err) {
      return res.status(500).json({
        title: "an error occured",
        error: err
      })
    }else{
      res.status(201).json({
        success: true,
        obj:result,
        body: "lift created!"
      });
    }
  });
});


module.exports = liftRoutes;
