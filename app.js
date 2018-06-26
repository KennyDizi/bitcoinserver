/*
The MIT License (MIT)

Copyright (c) 2016 saikath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var saveWalletReactor = require("./JSTech/reactors/saveWalletReactor");
var Animal = require("./JSTech/reactors/saveWalletReactor");

/*** loading mosca server ***/

var mosca = require("mosca");

/*###########################*/

/*** database settings for mongodb***/
var mongoDbUrl = "mongodb://localhost:27017/mqtt";
//var mongoDbUrl = "mongodb+srv://trungdc:Dinhchitrung09t2@cluster0-5dljf.gcp.mongodb.net/btcex";
//var mongoDbUrl = "mongodb://kennyd:Dinhchitrung09t2@cluster0-shard-00-00-5dljf.gcp.mongodb.net:27017,cluster0-shard-00-01-5dljf.gcp.mongodb.net:27017,cluster0-shard-00-02-5dljf.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

var dbSettings = {
    type: 'mongo', // it can be mongo / redis
    url: mongoDbUrl, //default is localhost:27017,mqtt is the db name
    pubsubCollection: 'mosca', //default collection name is pubsub.I prefer naming mosca
    mongo: {} // if any mongo specific options needed. I don't have any
  }
  /*##########################*/

/**** server settings ****/

var SECURE_KEY = __dirname + '../JSTech/secure/tls-key.pem';
var SECURE_CERT = __dirname + '../JSTech/secure/tls-cert.pem';

var serverSettings = {
  port: 1883, // default port is 1883 for mqtt

  //======== use these options for mqtts =======//
  /*
  secure : {
  	 port: 8884               //provide secure port if any (default 8883 ssl) 
	 keyPath: {your keypath}, //path of .pem file
     certPath: {your certpath} //path of .pem file
  }
   */
  //============= end =================//

  /*
   - this option will create a http server with mqtt attached. 
     - `port`   (optional)   the http port to listen. default 3000
     - `bundle` (optional)   if set to true then mqtt.js file will be served,so 
                             no need to download it.default is false.
     - `static` (optional)   provide your static files path.
    ** to access the mqtt.js or your static files put {yourhost}:{port}/staticfilename
   */
  http: {
    port: 3000,
    bundle: true,
    static: './public'
  },

  //======== use these options for https =======//
  /*
  credentials: {
	keyPath: {your keypath}, //path of .pem file
     certPath: {your certpath} //path of .pem file
  },*/
  /* https:{
  port : 3030, //(optional default 3001)
  bundle : true,
  static : ‘/’, 
  },*/
  //============= end =================//

  /*
   - this option will create a session over subscription and packets
     - `factory`       the persistence factory you want to choose from Mongo,Redis,LevelUp,Memory
     - `url`           the url of your persistence db
     - `ttl`(optional) the expiration of session
        - `subscriptions`  time period for subscriptions in ms (default 1 hour)
        - `packets`        time period for packets ini ms (default 1 hour)
     - `mongo`         the mongo specific options if any otherwise null object
     ** this module is specially used for retain messages
   */
  persistence: {
    factory: mosca.persistence.Mongo,
    url: mongoDbUrl,
    ttl: {
      subscriptions: 60 * 60 * 1000,
      packets: 60 * 60 * 1000,
    },
    mongo: {}
  },
  logger: {
    level: 'debug'
  },
  stats: false, //(optional) if set to true mosca keep informing about the server status
  //           on every 10s (default false) 
  // publish stats in the $SYS/<id> topicspace
  backend: dbSettings
}

/*#########################*/

/** creating the mqtt server **/

var server = new mosca.Server(serverSettings);

/*##########################*/

//authentication
var authorizer = require('./JSTech/lib/authorizer');

/*
//json
const fastJson = require('fast-json-stringify');
const stringify = fastJson({
  title: 'Transferable Message Schema',
  type: 'object',
  properties: {
    MessageStart: {
      description: 'STX message',
      type: 'integer'
    },
    MessageEnd: {
      description: 'ETX message',
      type: 'integer'
    },
    MessageType: {
      description: 'Type of message',
      type: 'integer'
    },
    MessageContent: {
      description: 'Content of message',
      type: 'string'
    }
  }
})
*/

//message type
let constants = require('./JSTech/messages/messageType');

/****** event listeners *********/

// fired when client is connected
server.on('clientConnected', function(client) {
  console.log("Client connected with id", client.id, "\n");
});

// fired when a message is received
server.on('published', function(packet, client) {
  if(client != undefined)
    {
      console.log("Message is published from client : ", client.id, "\n");    

      try {
        var data = packet.payload.toString("utf-8");
        var value = JSON.parse(data);
        console.log("Message received from package : \n", value);

        switch(value.MessageType)
        {
          case constants.hello:
          {
            /*
            for example
            Message received from package : 
            Object {MessageStart: 0, MessageEnd: 1, MessageType: 1001, MessageContent: "{"WalletAddress":"walletinfoexample","DeviceId":"1…"}            
            MessageContent:"{"WalletAddress":"walletinfoexample","DeviceId":"123","ConnecteDateTime":636656425583640150,"Id":0,"SenderId":100,"PassengerId":0,"Topic":"54eb54ce-f99b-4c80-8e0d-5239176dad32","IsSuccess":false}"
            MessageEnd:1
            MessageStart:0
            MessageType:1001
            */
            console.log("Hello message");
          }
          break;

          case constants.saveWallet:
          {
            console.log("Request save wallet informations message");
            var walletSaver = saveWalletReactor();
            walletSaver.saveWallet(null);
          }
          break;

          case constants.transactionHistory:
          {
            console.log("Request wallet transaction history message");
          }
          break;
        }
      } catch (err) {
        console.log(err);
      }
    }
});

server.on('subscribed', function(topic, client) {
  console.log("client", client.id, "subscribed topic", topic, "\n")
});

server.on('unsubscribed', function(topic, client) {
  console.log("client", client.id, "unsubscribed topic", topic, "\n")
});

server.on('clientDisconnected', function(client) {
  console.log("client", client.id, "clientDisconnected", "\n")
});

server.on('ready', setup);

function setup() {
  console.log('BTC Exchange server is running');
  console.log(server);
  
  /*
  server.authenticate       = authorizer.authenticate;
  server.authorizePublish   = authorizer.authorizePublish;
  server.authorizeSubscribe = authorizer.authorizeSubscribe;
  */
}

/*#############################*/