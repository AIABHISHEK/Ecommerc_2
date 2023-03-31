const express = require('express');
const path = require('path');

const router = express.Router();// router

const adminController = require('../controller/admin');
const auth_middleware = require("../auth-middleware/loggedIn");
const { check } = require('express-validator');

router.get('/admin/edit-product', auth_middleware.isLogged, adminController.getAddProduct);

// // to add new product
router.post('/admin/edit-product',
    auth_middleware.isLogged, adminController.postProduct);

// // to get products
router.get('/admin/products', auth_middleware.isLogged, adminController.getProduct);

// //to edit product
router.get('/admin/edit-product/:productId', auth_middleware.isLogged, adminController.getEditProduct); 

// //to save the edited product
router.post('/admin/edit-product',
    check('title')
        .isAlphanumeric()
        .withMessage('Title should we alphanumeric'),
    check('price')
        .isNumeric()
        .withMessage('Price should we in number only'),
    check('url')
        .isURL()
        .withMessage('url must be a valid url'),
    check('description')
        .trim(),
    auth_middleware.isLogged, adminController.postEditProduct);

// //to delete the product
router.get('/admin/delete/:productId', auth_middleware.isLogged, adminController.getDeleteProduct);

module.exports = router;