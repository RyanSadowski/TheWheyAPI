// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var User = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new User({
    updated_at: { type: Date, default: Date.now },
    username: {type: String, index: {unique: true}, required: [true, 'username required!']},
    password: {type: String, required: [true, 'password required!']},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type: String, required: false},
    active: {type: Boolean, default: true },
    xp: {type: Number, default: 0}
}));
