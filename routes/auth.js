const express = require('express');

const router = express.Router();
const { check, body } = require('express-validator');

const auth_ = require('../controller/auth');
const User = require('../models/user');


router.get('/signUp', auth_.getSignUp);

router.post('/signUp', check('email')
    .isEmail()
    .withMessage('Email is not valid')
    .custom((value, { req }) => {//custom validator looks for to return true or false promise or throw an error

        return User.findOne({ email: value })
            .then((user) => {
                if (user) {
                    return Promise.reject('Email already exists');
                }
            });
    }),
    body('password',
        'Entered password should be alphanumeric and minimum of length 6')
        .isAlphanumeric()
        .isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    auth_.postSignUp);


router.get('/login', auth_.getLogin);

router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Email is not valid'),
    body('password',
        'Entered password should be alphanumeric and minimum of length 6')
        .isAlphanumeric()
        .isLength({ min: 6 }),
    auth_.postLogin);

router.post('/logout', auth_.postLogout);


router.get('/reset', auth_.getReset);

router.post('/reset',
    check('email')
    .isEmail()
    .withMessage('Email is not valid'), auth_.postReset);

router.get('/resetPassword/:token', auth_.getResetPassword); 
router.post('/resetPassword',
    body('newPassword',
        'Entered password should be alphanumeric and minimum of length 6')
        .isAlphanumeric()
        .isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    }), auth_.postResetPassword);

module.exports = router;