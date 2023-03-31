
const { request } = require('express');
const { validationResult } = require('express-validator');
const Product = require('../models/product');
const utils = require('../utils/utils');
// this will control the renderinng of the add product page

exports.getAddProduct = (req, res, next) => {
    
    res.render("admin/edit-product",
        {
            docTitle: 'Add Product',
            path: '/admin/edit-product',
            editMode: false,
            errorMessage:undefined
        });
};

// this will handle the post of the add-product 

exports.postProduct = (req, res, next) => {
    let error = validationResult(req);
    console.log(error);
    if (!error.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/edit-product',
            editMode: false,
            errorMessage: error.array()[0].msg
        });
    }

    let title = req.body.title;
    let image = req.file;
    let price = req.body.price;
    let description = req.body.description;
    console.log(image);


    if (!image) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/edit-product',
            editMode: false,
            errorMessage: "not valid file type"
        });
    }
    let imageUrl = image.path;
    let p = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user._id
    });
// save method defined by mongoose returns callback and also promise
    p
        .save() 
        .then((results) => {
            console.log("Created Products");
            res.redirect('/');// redirect
        })
        .catch((err) => {
            console.log(err);
            const error = new Error("some error occured");
            console.log("this is " +  imageUrl);
            error.httpStatuscode = 500;
            return next(error);
            // res.redirect('/500');
            // console.log(err);
        });

};

exports.getProduct = (req, res, next) => {
//find is mongoose defined function to find 
    Product.find({userId:req.user._id})// find those products which are added by the client
        // populate will take path which have to be populated
        // in this we populate userdId with all information associated with that id in that model
        // .populate('userId')
        //select is used to get which fields we want to fetch and which we do not 
        // .select('price title')
        .then((results) => {
            console.log(results);
            console.log(results);
            res.render('admin/product', {
                products: results,
                docTitle: 'Admin Product',
                path: '/admin/products',
            });
        })
        .catch((err) => {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const editMode = req.query.editMode;

    if (editMode === "false") {
        return res.render('/');
    }
    Product.findById(id)
        .then((product) => {
            if (product) {
                res.render("admin/edit-product",
                    {
                        docTitle: 'Edit Product',
                        path: '/admin/edit-product',
                        editMode: true,
                        product: product,
                        errorMessage: undefined
                    });
            }
            else {
                res.send("bad request");
            }
        }).catch(err =>
        {
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err)
        });
};


exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const price = req.body.price;
    const image = req.file;
    const description = req.body.description;
// if save is called on existing mogodb object it will not create new one but update existing one
    Product.findById({ _id: id, userId: req.user._id })
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            if (image) {
                utils.deleteImage(result.imageUrl);
                product.imageUrl = image.path;
            }
            return product.save();
                
        })
        .then((result) => {
            console.log(" update successfully  ", result);
            res.redirect('/admin/products');
        })
        .catch(err => {// also catch rejction for promised returned by save()
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
            // console.log(err);
        });


};

exports.getDeleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete({_id:id, userId:req.user._id})
        .then((result) => {
            if (result) {
                utils.deleteImage(result.imageUrl);
                console.log("deleted  " + result);
                return res.redirect('/admin/products');
            }
            return res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
            const error = new Error("some error occured");
            error.httpStatuscode = 500;
            return next(error);
        });
};