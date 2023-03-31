const mongodb = require('mongodb');
const config = require('dotenv').config();

const MongoClient = mongodb.MongoClient;

let dbName;
const mongoConnect = (callback) => {
    const URL = process.env.MONGODB_URL;
    
    MongoClient.connect(URL)
        .then(client => {  // client object is returned which giv us access to datase
            // console.log(client);
            dbName = client.db('Shop');
            console.log(dbName);
            callback();
        })
        .catch(err => {
            console.log("this is erre" + err);
        });
    
};

const getDb = () => {
    console.log("this is the " , dbName);
    if (dbName) {
        return dbName;
    }
    throw "no database";
};

module.exports = {
    mongoConnect,
    getDb
};
