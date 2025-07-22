const User = require('./../models/userModel');
const AppError = require('../utils/appError');


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

// exports.updateMeValidator = [
//     body('password').not().exists().withMessage("This route is not for password update. Please use /updateMyPassword"),
//     body('passwordConfirm').not().exists().withMessage("This route is not for password update. Please use /updateMyPassword")
// ];

// to update the user name and email
exports.updateMe = async (req, res, next) => {
    try {

        const filteredBody = filterObj(req.body, 'name', 'email', 'password');

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
