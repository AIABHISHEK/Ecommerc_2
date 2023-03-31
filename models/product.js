const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    }
});

module.exports = mongoose.model('Product', productSchema);





















// const { ObjectId } = require('mongodb');

// const getDb = require('../connection/database').getDb;

// class Product {

//     /**
//      * @param {string} title 
//      * @param {number} price 
//      * @param {string} description 
//      * @param {string} imageUrl 
//      */
// /**
//  *  use validUrl package for url validating or check while taking by making input type url in html --> 
//  * @see https://stackoverflow.com/questions/30931079/validating-a-url-in-node-js#:~:text=Other%20easy%20way%20is%20use,url%20is%20valid%20or%20not.
//  * 
//  */
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = Product.trimExtraSpace(title);
//         this.price = price;
//         this.description = Product.trimExtraSpace(description);
//         this.imageUrl = imageUrl;       
//         this._id = id;
//         this.userId = userId;
//     }
// /**
//  * 
//  * @param {sting} s 
//  * @returns trimmed string with no extra space
//  */
//     static trimExtraSpace(s) {
//         let s_ = s.replace(/\s+/g, ' ').trim();
//         return s_;
//     }
// /**
//  * @function save saves data in database
//  */
//     save() {
//         // get the database in db
//         const db_ = getDb();
//         let db_return;
//         if (this._id) {
//             this._id = new ObjectId(this._id);
//             // $set sets the id also so we need to change this.id to ObjectId type in controller or in constructor
//             db_return = db_.collection('products').updateOne({ _id: this._id }, { $set: this });
//             console.log("product updated");
//         }
//         else {
//             db_return = db_.collection('products').insertOne(this);
//         }
//         return db_return
//             .then((result) => {
//                 console.log("saved or updated product",result);
//                 return result;
//             })
//             .catch((err) => {
//             console.log("err while add product" + err);
//         });
//     }

//     static fetchAll() {
//         const db_ = getDb();
//         /**
//          * find -> it does not return whole document immedeately but returns cursor
//          * @see https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
//          * @returns {js object array of products}
//         */
//         // use toArray when number of documents is less otherwise use pagination
//         return db_
//             .collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 // console.log(products);
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err);
//             });

//     }
//     /** 
//      * @param {ObjectId (A class representation of the BSON ObjectId type.)} id to find product associted with that id
//      * we can not compare pId (string ) to _id
//      * so convert pId to ObjectId type which is present in mongodb
//      * @returns product
//      * here find will give cursor
//      * to get the single element use which will be firs as well last
//      * @see https://www.mongodb.com/docs/manual/reference/method/cursor.next/
//     */
//     static findById(pId) {
//         const db_ = getDb();
//         return db_
//             .collection('products')
//             .findOne({ _id: ObjectId(pId) })
//             .then((product) => {
//                 console.log(product);
//                 return product;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }
//     static deleteById(id) {
//         const db_ = getDb();
//         return db_
//             .collection('products')
//             .deleteOne({ _id: ObjectId(id) })
//             .then((result) => {
//                 console.log("product deleted");
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = Product;
// // new product model definiton
