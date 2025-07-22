const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const validators = require('./validators');
const {loginRateLimit} = require('../middlewares/rateLimits');
const inputValidationMiddleware = require('./inputValidationMiddleware');

const userRouter = express.Router();


userRouter.post('/signup', authController.signup);
userRouter.post('/login', loginRateLimit, validators.loginValidator, inputValidationMiddleware, authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch('/updateMe', authController.protect, validators.updateUserValidator, inputValidationMiddleware, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);


userRouter.route('/')
    .get(userController.getAllUsers) // to retrieve all the users



module.exports = userRouter;