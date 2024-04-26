// Tag Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    reputation: {type: Number, required: true}
});

UserSchema
.virtual('url')
.get(function () {
return '/user/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);