var express       = require('express'),
db                = require('./db'),
cors              = require('cors'),
bodyParser        = require('body-parser'),
pg                = require('pg'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('./config'), // get our config file
bcrypt            = require("bcrypt"),
userRoutes        = require("./routes/userRoutes"),
liftRoutes        = require("./routes/liftRoutes"),
levelRoutes        = require("./routes/levelRoutes");
var homeRoutes        = require("./routes/homeRoutes");



var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

app.set('superSecret', process.env.Secret_key || config.secret);

var router = express.Router();

app.use(function(req, res, next) {
  next();
});

app.post('/', function(req, res){
  console.log(req.body);
      res.status(201).json({
        success: true,
        data: req.body,
        message: "Post Works"
      });
    });

app.get('/', function(req, res) {
      res.json({ message: 'Server is up. Please see API documentation to use' });
});




//user Routes including Auth and Account creation
app.use('/user', userRoutes);

// Require a token for the rest of the API routes.
app.use(function(req, res, next) {
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


app.use('/lifts', liftRoutes);
app.use('/level', levelRoutes);
app.use('/home', homeRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('hitting a pr of ' + port + ' lbs');
});

module.exports = app;
