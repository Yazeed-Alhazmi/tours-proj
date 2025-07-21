const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const validators = require('./validators');
const rateLimit = require('express-rate-limit');
const inputValidationMiddleware = require('./inputValidationMiddleware');

const userRouter = express.Router();

const loginLimiter = rateLimit({
    max: 5,
    window: 60 * 60 * 1000,
    message: 'To many request, please try again in an hour!'
});

userRouter.post('/signup', authController.signup);
userRouter.post('/login', loginLimiter, validators.loginValidator, inputValidationMiddleware, authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch('/updateMe', authController.protect, validators.updateUserValidator, inputValidationMiddleware, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);


userRouter.route('/')
    .get(userController.getAllUsers) // to retrieve all the users



module.exports = userRouter;