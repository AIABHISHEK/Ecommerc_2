const { mongoose } = require("mongoose");
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const config = require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.MY_API_KEY
    }
}));

exports.getSignUp = (req, res, next) => {
    res.render("login/signup.ejs", {
        docTitle: "signUp",
        path: "/signUp",
        errorMessage: req.flash('error-signUp')
    });
};

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.password;
    let errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render("login/signup.ejs", {
            docTitle: "signUp",
            path: "/signUp",
            errorMessage: errors.array()[0].msg
        });
    }
    bcrypt.hash(password, 10)
        .then((hashPassword) => {
            const user = new User({
                password: hashPassword,
                email: email,
                cart: { items: [] }
            });
            return user.save();
        })
        .then((result) => {
            res.redirect('/login');
            transporter.sendMail({
                to: email,
                from: "abhigame4u@gmail.com",
                subject: "thx for signup",
                html: '<h1>Thank You</h1>'
            })
                .then(() => {
                    console.log("email sent");
                }).catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });
};
exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[2]
    //     .trim()
    //     .split('=')[1] === 'true';
    // console.log(isLoggedIn);
    // console.log(req
    //     .get('Cookie')
    //     .split(';'));

    console.log(req.session.isLoggedIn);
    let error = req.flash('error');
    if (error.length > 0) {
        error = error[0];
    }
    else {
        error = null;
    }
    res.render("login/login.ejs", {
        docTitle: 'login',
        path: '/login',
        errorMessage: error
    });
    
};
exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true');
    // User.findById(mongoose.Types.ObjectId('62f3f54477cb10252c8fbaf2'))
    //     .then((user) => {
    //         req.session.isLoggedIn = true;
    //         req.session.user = user;
    //         // before redirecting if you want to make sure session is stored in database 
    //         req.session.save((err) => {
    //             console.log(err);
    //             res.redirect('/');
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    
    let errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render("login/login.ejs", {
            docTitle: "login",
            path: "/login",
            errorMessage: errors.array()[0].msg
        });
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then((result) => {
                        // result is boolean, true if match
                        if (result) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            req.session.save((err) => {
                                console.log(err);
                                res.redirect('/');
                            });
                        } else {
                            req.flash('error', 'your eamil or password is incorrect');
                            return res.redirect('/login');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            else {
                req.flash('error', 'No valid user exists');
                return res.redirect('/login');
            }
        }).catch(err => {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });// destory takes a function will be called after the 
};


exports.getReset = (req, res, next) => {
    let error = req.flash('error');
    if(error.length > 0) {
        error = error[0];
    }
    else {
        error = null;
    }
    res.render("login/reset.ejs", {
        docTitle: 'reset',
        path: '/reset',
        errorMessage: error
    });
};

exports.postReset = (req, res, next) => {
    //this creates 32 bit random token
    let errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).render("login/reset.ejs", {
            docTitle: "reset",
            path: "/reset",
            errorMessage: errors.array()[0].msg
        });
    }
    let token;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        else {
            token = buffer.toString('hex');
        }
    });
    const email = req.body.email;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash('error', 'No such user with exists');
                return res.redirect('/reset');
                
            }
            user.resetToken = token;
            user.resetExpirationDate = Date.now() + 3600000;
            return user.save();
        })
        .then((result) => {
            if (!result) {
                return;
            }
            res.redirect('/');
            transporter.sendMail({
                to: email,
                from: 'abhigame4u@gmail.com',
                subject: 'Reset Link for your password',
                html: `<p>This is the reset <a href="http://localhost:3000/resetPassword/${token}">link</a> </p>`
            }).then(() => {
                console.log("email link for password reset sent successfully");
            }).catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });
};

exports.getResetPassword = (req, res, next) => {

    const token = req.params.token;
    User.findOne({ resetToken: token, resetExpirationDate: { $gt: Date.now() } })
        .then((user) => {
            if (user) {
                let error = req.flash('error');
                if (error.length > 0) {
                    error = error[0];
                }
                else {
                    error = null;
                }
                res.render("login/resetPassword.ejs", {
                    docTitle: 'reset',
                    path: '/resetPassword',
                    errorMessage: error,
                    userId: user._id.toString(),
                    token:token
                });
            }
            else {
                req.flash('error', 'link is expired ');
                res.redirect('/reset');
            }
        })
        .catch(err => {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });

    
};

exports.postResetPassword = (req, res, next) => {
        

    const userId = req.body.userId;
    const token = req.body.token;
    const newPassword = req.body.newPassword;

        let errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(422).render("login/resetPassword.ejs", {
                docTitle: "Reset Password",
                path: "/resetPassword",
                errorMessage: errors.array()[0].msg,
                userId: userId,
                token: token
            });
        }

        let user;
        User.findOne({ resetToken: token, resetExpirationDate: { $gt: Date.now() }, _id: userId })
            .then((result) => {
                if (result) {
                    user = result;
                    return bcrypt.hash(newPassword, 10);
                }
                else {
                    req.flash('error', 'some error occurred while resetting password');
                    res.redirect('/reset');
                }
            })
            .then((hashedPassword) => {
                user.password = hashedPassword;
                user.resetToken = undefined;
                user.resetExpirationDate = undefined;
                return user.save();
            })
            .then((savedUser) => {
                console.log(savedUser);
                res.redirect('/login');
            })
            .catch(err => {
                const error = new Error("some error occured");
                error.httpStatuscode = 500;
                return next(error);
                // console.log(err);
            });
    };