/*

Homework Assignent 1
Author: Jonathan Annett

*/



// dependancies
var http = require('http'),
    https = require('https'),
    os = require('os'),
    cpuCount = os.cpus().length,// number of cores available
    cluster = (cpuCount===1) ? false : require('cluster'),
    
    // project dependancies
    config = require('./lib/config'),
    utils = require('./lib/utils'),
    
    // informational constants
    
    
    // protocol server instances
    servers = {},

    unified_server = function(req, res) {
    
        utils.getJsonPayload(req, function(payloadIn) {
    
            utils.getHandlerPathInfo(req, function(handlerPath, queryParams) {
    
                var handlerParams = {
                    when: new Date(),
                    method: req.method.toLowerCase(),
                    headers: req.headers,
                    via: req.connection.constructor.name === 'Socket' ? 'http' : 'https',
                    path: handlerPath,
                    queryParams: queryParams,
                    payloadIn: payloadIn
                };
    
                // call the appropriate handler returning http result and payload
                utils.getHandler(req, handlerPath) /*--exec-->*/ (handlerParams, function(httpCode, payloadOut) {
    
                    handlerParams.payloadOut = payloadOut || {};
    
                    // send httpcode, content-type and JSON string payload as http response 
                    res.writeHead(httpCode, {
                        "content-type": "application/json"
                    });
                    res.end(JSON.stringify(handlerParams.payloadOut));
    
                    // log the event 
                    console.log(handlerParams);
    
                });
    
            });
        });
    
    },
    
    // start servers for each protocol
    start_servers = function () {

        servers.http = http.createServer(unified_server);
        
        servers.https = https.createServer(config.https.options, unified_server);
        
        
        // start each server.
        Object.keys(servers).forEach(function(protocol) {
        
            servers[protocol].listen(config[protocol].port, function() {
                console.log(config.envMode + " server started using " + protocol + " protocol on port " + config[protocol].port);
            });
        
        });
        
    },
    
    // if we are in clustering mode, start the app via cluster
    // otherwise, start the app by simply starting the servers
    start_app = cluster ? function() {
        if (cluster.isMaster) {
            for(var i = 0; i < cpuCount; i++) {
                cluster.fork();
            }
        } else {
            start_servers();
        }
    } : start_servers ;
    
    
    
    // start the app.
    start_app();
    