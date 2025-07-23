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

userRouter.patch('/update', authController.protect, inputValidationMiddleware(validators.updateUserValidator), userController.update);
userRouter.delete('/delete', authController.protect, userController.delete);

userRouter.patch('/updatePassword', authController.protect, userController.updatePassword);

userRouter.use('/reviews', authController.protect, reviewRouter);

userRouter.route('/')
    .get(userController.getAllUsers) // to retrieve all the users


module.exports = userRouter;