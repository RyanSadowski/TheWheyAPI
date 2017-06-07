var express       = require('express'),
cors              = require('cors'),
bodyParser        = require('body-parser'),
mongoose          = require('mongoose'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('./config'), // get our config file
bcrypt            = require("bcrypt"),
User              = require("./models/user"),
userRoutes        = require("./routes/userRoutes");



var app = express();
app.use(bodyParser.json({
  extended: true
}));
app.use(cors());

var router = express.Router();

router.use(function(req, res, next) {
  console.log('the journey has begun');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'Please see API documentation' });
});

app.use('/user', userRoutes);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.database)
.then(() => console.log('DumbBell is up'))
.catch((err) => console.error(err));

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('hitting a pr of ' + port + ' lbs');
});



module.exports = app;
