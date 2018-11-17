// this file defines the router module
var router = module.exports = {}, 
    //this file has some app dependancies
   handlers = require('./handlers');



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