/*

app specific util functions

*/


// this file defines the utils module
var utils = module.exports = {},
    // this file has some system dependancies
    url = require('url'),
    StringDecoder = require('string_decoder').StringDecoder,
    //this file has some app dependancies
    handlers=require('./handlers'),
    router=require('./router');




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