// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Lift = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Lift', new Lift({
    updated_at: { type: Date, default: Date.now },
    name:String,
    desc:String,
    muscleGroup:String
}));
