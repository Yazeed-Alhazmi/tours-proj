const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const validators = require('./../models/validators');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', validators.loginValidator, authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch('/updateMe', authController.protect, validators.updateUserValidator, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);


userRouter.route('/')
    .get(userController.getAllUsers) // to retrieve all the users



module.exports = userRouter;