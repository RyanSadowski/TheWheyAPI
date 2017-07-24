var express       = require('express'),
db                = require('../db'),
userRoutes        = express.Router(),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
userService       = require('../userService'),
bcrypt            = require("bcrypt");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

userRoutes.post('/setup', function(req, res){
  db.query("INSERT INTO users(username, password, email, first, last) VALUES ($1, $2, $3, $4, $5) RETURNING id",
  [req.body.username, bcrypt.hashSync(req.body.password, 10), req.body.email, req.body.firstName, req.body.lastName],   //, bcrypt.hashSync(req.body.password, 10)
  function(err, result){
    if(err){
      console.error("error saving user ", req.body.username)
      return res.status(500).json({
        title: "an error occured",
        error: err
      });
    }else{
      res.status(201).json({
        success: true,
        id:result.rows[0].id,
        message: "user registered"
      });
    }
  });
});

//Authenticate a User and return a token
userRoutes.post("/auth", function(req, res) {
  db.query('SELECT * FROM users WHERE username = ($1)', [req.body.username],function(err, result){
    //console.log(result.rows[0]);
    if(!result.rows[0]){
      //username not found
      console.log("username not found " , req.body.username);
      res.status(401).json({
        success: false,
        message: 'Authentication failed. no username ' + req.body.username
      });
    }else if(err){
      //error
      return res.status(500).json({
        title: "an error occured",
        error: err
      });
    }else{
      //username found. Lets compare passwords.
      if (!bcrypt.compareSync(req.body.password, result.rows[0].password)){
        //wrong password
        console.log("wrong password");
        res.status(401).json({
          success: false,
          message: 'Authentication failed. wrong password'
        });
      }else{
        //give token
        //console.log("right password");

        var token = jwt.sign({
          data: result.rows[0].username,
          id: result.rows[0].id},
          app.get('superSecret'),
          { expiresIn: 60 * 60 * 168 }); //token is good for one week

          // return the information including token as JSON
          res.status(201).json({
            success: true,
            token: token,
            username: req.body.username,
            id: result.rows[0].id
          });
        }
      }

    });
  });



  // We probably shouldn't return the password in the api call when you're looking at all the users.....
  userRoutes.get('/all', function(req, res) {
    db.query('SELECT * FROM users', function(err, result){
      if(err){
        //error
        return res.status(500).json({
          title: "an error occured",
          error: err
        });
      }else{
        //If query was successful
        for(var i in result.rows){
          delete result.rows[i].password;
          //maybe we dont want to pass the email either...
          delete result.rows[i].email;
        }
        res.status(200).json({
          success: true,
          message: "all users",
          body: result.rows
        });
      }
    });
  });

  //We'll want to get anyone's stats
  userRoutes.post('/stats/:id', function(req, res) {
    db.query('SELECT * FROM users WHERE id = ($1)', [req.params.id],function(err, result){
      if(err){
        //error
        return res.status(500).json({
          title: "an error occured",
          error: err
        });
      }else if(result.rows[0]){
        delete result.rows[0].password;
        return  res.status(200).json({
          success: true,
          message: "user stats",
          body: result.rows
        });
      }else{
        return res.status(204).json({
          title: "User does not exist"
        });
      }
    });
  });

  //You can only delete yourself.
  userRoutes.delete('/rip', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'bad token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          db.query('DELETE FROM users WHERE id = ($1)', [req.decoded.id],function(err, result){
            if(err){
              //error
              return res.status(500).json({
                title: "an error occured",
                error: err
              });
            }else if(result.rowCount == 1){
              return  res.status(201).json({
                success: true,
                message: "user deleted",
                body: result.rows
              });
            }else{
              return  res.status(201).json({
                success: false,
                message: "user not found",
                body: result.rows
              });
            }
          });
        }
      });

    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'Need a token homie'
      });
    }

  })

  module.exports = userRoutes;
