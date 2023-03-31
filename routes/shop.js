const express = require('express');

const router = express.Router();

const adminData = require('./admin');

const shopController = require('../controller/shop');
const auth_middleware = require("../auth-middleware/loggedIn");

// // default routes
router.get('/', shopController.getIndex);

// //product route
router.get('/product', shopController.getProduct);

// // cart route
router.get('/cart/:id', auth_middleware.isLogged, shopController.getAddCart);

// //
router.get('/cart', auth_middleware.isLogged, shopController.getCart);
// 
// //product details
router.get('/product-details/:productId', shopController.getProductDetails);


router.post('/delete-item-cart', auth_middleware.isLogged, shopController.getDeleteItemFromCart);

// //product list
// // router.get('/product-list', shopController.getProductList);

// // checkout routes
// router.get('/checkout', shopController.getCheckout); //

router.get('/orderProduct', auth_middleware.isLogged, shopController.getOrder);
// // order list
router.get('/order', auth_middleware.isLogged, shopController.getOrderDetails);

// to download order invoice
router.get('/order/:orderId', auth_middleware.isLogged, shopController.getOrderInvoice);

module.exports = router;