/*

Homework Assignent 1
Author: Jonathan Annett

*/



    // dependancies
var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    StringDecoder = require('string_decoder').StringDecoder,
    // project dependancies
    config = require('./lib/config'),
    // internal collections
    handlers = { 
        // generic fallback handler that returns an empty object
        // note- for future REPL testing, if cb is not supplied, payload object is returned.
        notFound : function(data, cb) {
             var payloadOut = {};
             return typeof cb === 'function' ? cb(200, payloadOut) : payloadOut;
         } 
    },
    // 
    router = {
        
    },
    
    utils = {};

// project utils @TODO move to utils.js

// asyncronously read any body from http(s) request, treating it as an utf-8 string
utils.getBody = function(req, callback) {
    var body = '',
        decoder = new StringDecoder('utf-8');
    req.on('data', function(data) {
        body += decoder.write(data);
    });
    req.on('end', function() {
        callback(body + decoder.end());
    });
};

// asyncronously read an optional JSON payload from the request body, pass it to callback as an object
utils.getJsonPayload = function (req,callback) {
    utils.getBody(req,function(body){
        try {
            // if there's a non-zero length string in body, try and parse it as json, otherewise ignore it
            callback(typeof body === 'string' && body.length ? JSON.parse(body) : undefined);   
        } catch (err) {
            // if invalid json is passed, throw out payload and pretend there was no body
            callback();
        }
    });
};

// extract the hander path from the request
utils.getHandlerPathInfo = function(req,cb) {
    var u = url.parse(req.url, true);
    u.trimmedPath = u.pathname.replace(/^\/+|\/+$/g, '');
    return typeof cb==='function' ? cb (u.trimmedPath,u.query) : u;
};

// convert handlerPath to callable handler
// see router defintions below for more info
utils.getHandler = function(req,handlerPath) {
    var handler = (router[req.method.toLowerCase()]||{})[handlerPath];
    if (typeof handler!=='function') handler = router.ALL[handlerPath];
    return typeof handler === 'function' ? handler : handlers.notFound;
};


// handler for homework assignment 1:
// When someone posts anything to the route /hello, you should return a welcome message, in JSON format. 
// This message can be anything you want. 
handlers.hello = function(data, cb) {
    
    var payloadOut = {
        hello: "world",
        message : "Anything you want",
        postPayload : typeof data.payloadIn  === "object" ? data.payloadIn  : { "note" : "no data was posted" }
    };
    
    return typeof cb === 'function' ? cb(200, payloadOut) : payloadOut;
};


// generic handler to echo to incoming request
handlers.echo = function(data, cb) {
    
    var payloadOut = {
        method      : data.method,
        via         : data.via,
        path        : data.path,
        payloadIn   : data.payloadIn
    };
    
    return typeof cb === 'function' ? cb(200, payloadOut) : payloadOut;
};


// define router.method.pathname to define specfic method handlers
// all method handlers can be created using router.ALL.pathname 

router.post = {
    // When someone posts anything to the route /hello, you should return a welcome message, in JSON format. 
    // This message can be anything you want. 
    hello : handlers.hello
};


router.get = {
    // instructions were to only send the welcome message to routes that POST to /hello
    // so just bounce back a get request to hello.
    hello : handlers.echo
};

// generic method handler in here need to check method to determine what they are actually doing.
router.ALL = {
    echo : handlers.echo
};

// main request handler for https and http protocol instances
var request_handler = function(req, res) {

    utils.getJsonPayload(req, function(payloadIn) {
        
        utils.getHandlerPathInfo(req, function(handlerPath,queryParams){
            
            var handlerParams = {
               when        : new Date(),
               method      : req.method.toLowerCase(),
               headers     : req.headers,
               via         : req.connection.constructor.name==='Socket' ? 'http' :'https',
               path        : handlerPath,
               queryParams : queryParams,
               payloadIn   : payloadIn
           };

           // call the appropriate handler returning http result and payload
            utils.getHandler(req,handlerPath)/*--exec-->*/( handlerParams, function(httpCode, payloadOut) {
    
                handlerParams.payloadOut = payloadOut || {};
                
                // send httpcode, content-type and JSON string payload as http response 
                res.writeHead(httpCode, {"content-type": "application/json"});
                res.end(JSON.stringify(handlerParams.payloadOut));
               
                // log the event 
                console.log(handlerParams);
                
            });
            
        });
    });

};

// protocol server instances
var servers = {

    http: http.createServer(request_handler),
    
    https: https.createServer(config.https.options, request_handler),

};

// start each server.
Object.keys(servers).forEach(function(protocol) {

    servers[protocol].listen(config[protocol].port, function() {
        console.log(config.envMode + " server started using " + protocol + " protocol on port " + config[protocol].port);
    });

});

