var express       = require('express'),
userRoutes        = express.Router(),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('../config'), // get our config file
bcrypt            = require("bcrypt"),
User              = require("../models/user");
var app = express();

app.set('superSecret', process.env.Secret_key || config.secret);

userRoutes.post('/setup', function(req, res){
  console.log(req);
  var user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  });
  user.save(function(err,result){
    if(err) {
      return res.status(500).json({
        title: "an error occured",
        error: err
      })
    }else{
      res.status(201).json({
        success: true,
        obj:result,
        body: "user registered"
      });
    }
  });
});

userRoutes.post('/', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured!',
        error: err
      });
    }else{
      return res.status(201).json({
          success: true,
          body: user
      });
    }
  });
});

userRoutes.post("/auth", function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      return res.status(500).json({
        title: 'An error occured!',
        error: err
      });
    }
    //user not found in db
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    } else if (user) {
      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).json({
          success: false,
          message: 'Authentication failed.'
        });
      }
      else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 180000 // expires in 60*5 minutes
        });

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
          message: 'Failed to authenticate token.'
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
      message: 'Not authenticated'
    });
  }
});

/*=========================
NEED A TOKEN FOR ANYTHING AFTER THIS COMMENT
==========================*/

userRoutes.get('/all', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

module.exports = userRoutes;
