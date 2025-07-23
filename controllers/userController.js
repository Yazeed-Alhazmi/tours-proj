const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const redisClient = require('../utils/redis');

const catchAsync = fn => {
    
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        
        res.status(200).json({
            status:"succsess",
            data: users
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};




// filter function to allow only specific fields from the body to be updated by the user using the updateMe controller 
const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    });
    return newObj;
}


// to update the user name and email
exports.updateMe = async (req, res, next) => {
    try {

        const filteredBody = filterObj(req.body, 'name', 'email');

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});
        

            res.status(200).json({
            status:"succsess",
            data: {
                user: updatedUser
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

// to delete a user by updating the delete flag to 'true'
exports.deleteMe = async (req, res, next) => {
    try {
        await User.deleteById(req.user.id);

        res.status(204).json({
            status:"succsess",
            data: null
        });
    }
    catch (err) {
        res.status(500).json({
            status:"failed",
            message: err
        });
    }
};



// to update the user name and email
exports.updatePassword = async (req, res, next) => {
    try {

        const userID = req.user.id;
        const newPass = req.body.password;
        const newPassConfirm = req.body.passwordConfirm;

        const user = await User.findById(userID);

        user.password = newPass;
        user.passwordConfirm = newPassConfirm;

        await user.save();

        let token
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = jwt.decode(token);
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
            await redisClient.set(token, 'blacklisted', {
            expiresIn: expiresIn
            });
        }

        
            res.status(200).json({
            status:"succsess",
            data: {
                user: user
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