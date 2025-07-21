const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const {promisify} = require('util');
const crypto = require('crypto');


const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
 

// to make a jwt token
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


// a sign up
exports.signup = async (req, res, next) => {
    try {
        // filtering the body
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt,
            role: req.body.role
        });

        // initiating a token using the user id
        const token = signToken(newUser._id);

        res.status(201).json({
            status:'success',
            token,
            data: {
                user: newUser
            }
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
   
        const user = await User.findOne({email}).select('+password'); // password is (select:false) in the schema so we need to use the '+' sign

        // if the user does not exist or incorrect password return an error with a message
        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password', 401)); 
        }
    
        // initiating a token using the user id
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


// a middleware to check the user info
exports.protect = catchAsync(async (req, res, next) => {

    // check if the token exist
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }


    if(!token){
        return next(new AppError('You are not logged in', 401)); 
    }

    // decoding the token to get the user id
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // retrieve the user using the id
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user does no longer exist', 401));
    }

    // check if the user changed it's password or not (if yes return an error)
    if (!currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User changed the password. Please log in again', 401));
    }

    req.user = currentUser;

    next();
});


// a restirct middleware to check roles (admin, user, lead-guide, guide)
exports.role =  (...roles) => {
    return (req, res, next) => {
        
        if(!roles.includes(req.user.role)){
            return next(new AppError('You don not have permission to perform this action', 403));
        }
        next();
    }
};



exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return next(new AppError('No user with that email', 404));
        }

        // the reset password token
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

        // the url that will be sent by email to the user
        const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}}`;

        // email message
        const message = `Forgot your password? Submit a PATCH request with a new password 
        and passwordConfirm to: ${resetURL}. \nIf you didn't forgot your password, please ignore this email.`;

        // sending the email
        try{
            await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message: message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
        }
        catch (err){
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({validateBeforeSave: false});

            return next(new AppError('There was an error sending the email. Try again later', 500));
        }
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires:{$gt:Date.now()}
        });



        if(!user){
            return next(new AppError('Token has expired', 400));
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();


        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};

