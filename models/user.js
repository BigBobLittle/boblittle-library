
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    password: {type:String, required:true}
});



//schema methods
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next(); //? user.isNew
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, (err, hashed)=> {
            if(err) return next(err);
            user.password = hashed;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(userPassword , callback){
    bcrypt.compare(userPassword, this.password, function(err, matchedPassword){
        if(err) callback(err);
        callback(null, matchedPassword);
    });
}

module.exports = mongoose.model('User', userSchema);