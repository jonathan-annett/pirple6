
// this file defines the handlers module
var handlers = module.exports = { 

};

// generic fallback handler that returns an empty object
// note- for REPL testing, if cb is not supplied, payload object is returned.
handlers.notFound = function(data, cb) {
     var payloadOut = {};
     return typeof cb === 'function' ? cb(200, payloadOut) : payloadOut;
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
