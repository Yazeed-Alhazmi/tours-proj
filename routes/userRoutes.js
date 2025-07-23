const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const validators = require('./validators');
const inputValidationMiddleware = require('./inputValidationMiddleware');
const {loginRateLimit} = require('../middlewares/rateLimits');
const reviewRouter = require('./reviewRoutes');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', loginRateLimit, inputValidationMiddleware(validators.loginValidator), authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch('/updateMe', authController.protect, inputValidationMiddleware(validators.updateUserValidator), userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

userRouter.use('/reviews', authController.protect, reviewRouter);

userRouter.route('/')
    .get(userController.getAllUsers) // to retrieve all the users


module.exports = userRouter;