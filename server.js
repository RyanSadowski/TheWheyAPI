var express       = require('express'),
db                = require('./db'),
cors              = require('cors'),
bodyParser        = require('body-parser'),
pg                = require('pg'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('./config'), // get our config file
bcrypt            = require("bcrypt"),
userRoutes        = require("./routes/userRoutes");
liftRoutes        = require("./routes/liftRoutes");


var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

var router = express.Router();

app.use(function(req, res, next) {
  console.log('the journey has begun');
  next();
});

app.use('/user', userRoutes);
app.use('/lifts', liftRoutes);

app.get('/', function(req, res) {
    db.query('SELECT $1::int AS number',['1'], function(err, result){
      if(err){
        return console.error("db error : ", err)
      }
      console.log(result.rows[0].number);
    });

  res.json({ message: 'Please see API documentation' });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('hitting a pr of ' + port + ' lbs');
});

module.exports = app;
