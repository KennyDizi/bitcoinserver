var MongoClient = require('mongodb').MongoClient;

//var uri = "mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test";
var uri = "mongodb://localhost:27017/mqtt";
let constants = require('../messages/messageType');

module.exports = function saveWalletReactor (){
    function saveWallet(wallet)
    {
        MongoClient.connect(uri, function(err, client) {
            const collection = client.db("mqtt").collection("wallets");
            // perform actions on the collection object
            if(collection.findOne(x => x.walletAddress == wallet.walletAddress) != null)
            {

            }

            client.close();
         });
    }
    return{
        saveWallet: saveWallet
    }
}

'use strict'; 
class Animal{

 constructor(name){
    this.name = name ;
 }

print(){
    console.log('Name is :'+ this.name);
 }
}