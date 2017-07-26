var express       = require('express'),
db                = require('../db'),
levelRoutes        = express.Router(),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
userService       = require('../userService'),
bcrypt            = require("bcrypt");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

  // We probably shouldn't return the password in the api call when you're looking at all the users.....
  userRoutes.get('/all', function(req, res) {
    db.query('SELECT * FROM levels', function(err, result){
      if(err){
        //error
        return res.status(500).json({
          title: "an error occured",
          error: err
        });
      }else{
        //If query was successful
        res.status(200).json({
          success: true,
          message: "all levels",
          body: result.rows
        });
    }
  });
  });


  module.exports = userRoutes;
