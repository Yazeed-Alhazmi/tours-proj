const {body} = require('express-validator');

exports.loginValidator = [
    body('email').notEmpty().withMessage('Please provide an email'),
    body('email').isEmail().withMessage('Please provide a valid email'),

    body('password').notEmpty().withMessage('Please provide an password'),
]

exports.updateUserValidator = [

    // body('password').not().exists().withMessage("This route is not for password update. Please use /updateMyPassword2"),
    body('passwordConfirm').not().exists().withMessage("This route is not for password update. Please use /updateMyPassword2"),
]