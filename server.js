var express       = require('express'),
cors              = require('cors'),
bodyParser        = require('body-parser'),
mongoose          = require('mongoose'),
jwt               = require('jsonwebtoken'), // used to create, sign, and verify tokens
config            = require('./config'), // get our config file
bcrypt            = require("bcrypt"),
User              = require("./models/user"),
Lift              = require("./models/lift"),
userRoutes        = require("./routes/userRoutes");
liftRoutes        = require("./routes/liftRoutes");



var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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
app.use('/lifts', liftRoutes);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.database)
.then(() => console.log('DumbBell is up'))
.catch((err) => console.error(err));

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('hitting a pr of ' + port + ' lbs');
});



module.exports = app;
