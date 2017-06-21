var express       = require('express'),
db                = require('../db'),
userRoutes        = express.Router(),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
bcrypt            = require("bcrypt");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

userRoutes.post('/setup', function(req, res){
  console.log(req);

  db.query('INSERT INTO users(username, password, email, first, last) VALUES ($1, $2, $3, $4, $5) RETURNING id',
  [req.body.username, bcrypt.hashSync(req.body.password, 10), req.body.email, req.body.firstName, req.body.lastName],
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
        body: "user registered"
      });
    }
  });
});


userRoutes.post("/auth", function(req, res) {
  db.query('SELECT * FROM users WHERE username = ($1)', [req.body.username],function(err, result){
    console.log(result.rowCount);
    if(err){
      //error
      return res.status(500).json({
        title: "an error occured",
        error: err
      });
    }else if (result.rowCount == 0 ) {
      //username not found
      console.log("username not found " , req.body.username);
      res.status(401).json({
        success: false,
        message: 'Authentication failed. no username ' + req.body.username
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
        console.log("right password");

        var token = jwt.sign({
          data: result.rows[0].username},
          app.get('superSecret'),
          { expiresIn: 60 * 60 * 168 }); //token is good for one week

          // return the information including token as JSON
          res.status(201).json({
            success: true,
            token: token,
            username: req.body.username
          });
        }
      }
    });
  });

  userRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
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
          next();
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
  });

  /*=========================
  NEED A TOKEN FOR ANYTHING AFTER THIS COMMENT
  ==========================*/

  userRoutes.get('/all', function(req, res) {
    db.query('SELECT * FROM users', function(err, result){
      if(err){
        //error
        return res.status(500).json({
          title: "an error occured",
          error: err
        });
      }else{
        res.status(201).json({
          success: true,
          message: "all users",
          body: result.rows
        });
      }
    });
  });

  module.exports = userRoutes;
