const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
// user model
var userSchema = new mongoose.Schema({
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    resetToken: String,
    resetExpirationDate:Date,
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity: {
                type: Number,
                required:true
            }
        }]
    }
    
});

userSchema.methods.addToCart = function (product) {

    const itemIndex = this.cart.items.findIndex(cartProduct => {
        return cartProduct.productId.toString() === product._id.toString();
    });
    let updatedCart;
    let newQty = 1;
    const updatedItems = [...this.cart.items];
    if (itemIndex >= 0) {
        console.log("not new prod");
        newQty = updatedItems[itemIndex].quantity + 1;
        updatedItems[itemIndex].quantity = newQty;
        updatedCart = { items: updatedItems };
    }
    else {
        console.log("it is new");
        updatedItems.push({
            productId: product._id,
            quantity: newQty
        });
        updatedCart = { items: updatedItems };
        // updatedCart = { items: [...updatedCart.items,{ productId:new ObjectId(product._id), quantity: 1 }] };
    }
    // const updatedCart = { items: [{ ...product, quantity: 1 }] };
    // const updatedCart = { items: updatedItems };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteItemsFromCart = function (id) {
    const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== id.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.deleteAllItemsFromCart = function () {
    this.cart.items = [];
    return this.save();
}
//Export the model
module.exports = mongoose.model('users', userSchema);



// const { ObjectId } = require('mongodb');
// const Product = require('./product');

// const getDb = require('../connection/database').getDb;

// class Users {

//     /** 
//      * @param {string} userName 
//      * @param {string} email 
//      */
//     constructor(userName, email, cart, id) {
//         this.userName = userName;
//         this.email = email;
//         this.cart = cart; //{items:[],quantity:1}
//         this._id = id;
//     }

//     save() {
//         const db_ = getDb();
//         return db_
//             .collection('users')
//             .insertOne(this);
//     }

//     static findById(Userid) {
//         const db_ = getDb();
//         return db_
//             .collection('users')
//             .findOne({ _id: new ObjectId(Userid) })
//             .then((user) => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {

//         const itemIndex = this.cart.items.findIndex(cartProduct => {
//             return cartProduct.productId.toString() === product._id.toString();
//         });
//         let updatedCart;
//         let newQty = 1;
//         const updatedItems = [...this.cart.items];
//         if (itemIndex >= 0) {
//             console.log("not new prod");
//             newQty = updatedItems[itemIndex].quantity + 1;
//             updatedItems[itemIndex].quantity = newQty;
//             updatedCart = { items: updatedItems };
//         }
//         else {
//             console.log("it is new");
//             updatedItems.push({
//                 productId: ObjectId(product._id),
//                 quantity: newQty
//             }
//             );
//             updatedCart = { items: updatedItems };
//             // updatedCart = { items: [...updatedCart.items,{ productId:new ObjectId(product._id), quantity: 1 }] };
//         }
//         const db_ = getDb();
//         // const updatedCart = { items: [{ ...product, quantity: 1 }] };
//         // const updatedCart = { items: updatedItems };
//         return db_.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: updatedCart } }
//         );
//     }


//     deleteProductFromCart(id) {
//         const updatedCartItems = this.cart.items.filter(p => {
//             return p.productId.toString() !== id.toString();
//         });
//         console.log("this updated ", updatedCartItems);
//         const db_ = getDb();
//         return db_.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: updatedCartItems } } }
//         );
//     }

//     addToOrder() {
//         const db_ = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: this._id,
//                         name: this.userName
//                     }
//                 };
//                 return db_
//                     .collection('orders')
//                     .insertOne(order);
//             })
//             .then((products) => {
//                 this.cart = { items: [] };
//                 console.log("products ordered", products);
//                 return db_
//                     .collection('users')
//                     .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     getOrderDetails() {
//         const db_ = getDb();
//         return db_
//             .collection('orders')
//             .find()
//             .toArray()
//             .then((orders) => {
//                 return orders;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = Users;