const config = require('dotenv').config();
const path = require('path');
const bodyparser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require("multer");



const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorPage = require('./controller/error');


const database = require('./connection/database');
const User = require('./models/user');


const app = express();


const URL = process.env.MONGODB_URL;

const csrfProtection = csrf();

const store = new mongoStore({
    uri: URL,
    collection: 'sessions'
});
// if (process.env.NODE_ENV === 'production') {
//   // Set production environment variables here
//   process.env.DB_HOST = 'production_db_host';
//   process.env.API_KEY = 'production_api_key';
// } else {
//   // Set development environment variables here
//   process.env.DB_HOST = 'development_db_host';
//   process.env.API_KEY = 'development_api_key';
// }

// // Use the environment variables in your application
// const dbHost = process.env.DB_HOST;
// const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.set('views', 'views');    // by default it is views

app.use(bodyparser.urlencoded({ extended: false }));

// const fileStorgae = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images'); //(error, destination folder)
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + '-' + file.originalname);
//     }
// });
const storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'images/png', 'images/jpg', 'images/jpeg') {
        cb(null, true);
    }
    else {
        cb(cb, false); 
    }
};

//dsetting dest param stored the file in that folder
app.use(multer({storage:storage, fileFilter:filefilter}).single('image'));

//it will do body parsing of the request
// app.use((req, res, next) => {  // middleware are function through which every request have to passed through before sending the response , they are filter


// serving folder statically considered as as the content of that folder is in root directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
//resave --false means will save session on every request until there is change
app.use(
    session(
        {
            secret: 'abhishek',
            resave: false, saveUninitialized: false,
            store:store  // store in mogo database session keys
        }
    )
);

// so after session initialization 
app.use(csrfProtection); // we need add csrf token in each view containing form that is that have post and also we need to pass csrf token to each req(for each rendering)
app.use(flash());


app.use('/', (req, res, next) => {
    // console.log(req.session.user);
    if (req.session.user == undefined) {
        next();
    }
    else {
        User.findById(req.session.user._id)
            .then((user) => {
                // make sure user exists and it is not undefined
                if (user) {
                    req.user = user;
                }
                return next();
            })
            .catch((err) => {
                throw new Error(err);
                // console.log(err);
            });
    }
});

//in inorder to send some data for every request use this
app.use((req, res, next) => {
    res.locals.isLogged = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use(adminRoute);
// if we have common path before entering adminRoute we can use this app.use('/admin', adminRoute)
app.use(authRoute);


app.use(shopRoute);

app.get('/500', errorPage.get500Page);

// to send 404 page not found Error for unknown requests
app.use(errorPage.get404Page);

// const server = http.createServer(app);
// server.listen(3000);

// this error handling middleware is called when we pass error to next() as arg so express skips all middleware and calls error handling middleware
app.use((error, req, res, next) => {
    console.log(req.url);
    console.log(error);
    res.redirect('/500');
});
const PORT = process.env.PORT || 3000;
mongoose.connect(URL)
    .then((result) => {
        User.findOne()
            .then(user => {
                
            });
        app.listen(PORT, () => {
            console.log('App listening on port 3000!');
        });
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     app.listen(3000); // once connection established run the app
// });