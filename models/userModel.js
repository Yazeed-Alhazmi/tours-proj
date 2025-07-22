const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose_delete = require('mongoose-delete');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true
    },
    photo: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password']
        // validate: {
        //     validator: function(el){
        //         return el === this.password;
        //     },
        //     message: "Passwords are not the same"
        // }
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken:{
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
});



// A password hashing middleware. will run for new users or when users changes the password
userSchema.pre('save', async function(next){

    if(this.isModified('password') || this.isNew){

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    if(!this.isNew){
        this.passwordChangedAt = Date.now();
    }
    }
    next();
});


userSchema.plugin(mongoose_delete, { deletedAt: true , overrideMethods: 'all' });


// to compare the input password with the hashed one
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};

// to log out the user if password has changed
// userSchema.methods.changedPasswordAfter = async function(JWTtimestamp){
//     if(this.passwordChangedAt){
//         const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);

//         return JWTtimestamp < changedTimestamp;
//     }

//     return false;
// };



const User = mongoose.model('User', userSchema);



module.exports = User;