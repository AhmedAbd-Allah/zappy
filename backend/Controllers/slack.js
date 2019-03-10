var request = require('request');
var WebSocket = require('ws');
var events = require('events').EventEmitter;
var EventEmitter = new events();
var { setWsHeartbeat } = require('ws-heartbeat/client');
const Config = require('./../Config')
const async = require('async')

var apiRequest = function (req) {
    return new Promise(function (resolve, reject) {

        request.post(req, function (err, request, body) {
            if (err) {
                reject(err);

                return false;
            }

            try {
                body = JSON.parse(body);

                if (body.ok) {
                    resolve(body);
                } else {
                    reject(body);
                }

            } catch (e) {
                reject(e);
            }
        });
    });
}

module.exports = {
    apiRequest,

    listen: function (req, callback){
        this.connect(req, function (err, response) {
            if (err)
                return err;
            webSocket = new WebSocket(response.workSpaceData.wsUrl);
            setWsHeartbeat(webSocket, '{ "kind": "ping" }');

            webSocket.on('open', function(data) {
                EventEmitter.emit('open', data);
            })
   
            webSocket.on('close', function(data) {
                EventEmitter.emit('close', data);
            })
            webSocket.on('message', function (data) {
                try {
                    EventEmitter.emit('message', JSON.parse(data));
                    return callback(null,data)
                } catch (e) {
                    console.log(e);
                }
               
            })
        })
    },
    connect: function (req, callback) {
        var dataHolder = {};
        async.series([
            function (cb) {
                if (!(req.token || req.name))
                    return cb("Enter valid token and name")
                dataHolder.requestData = {
                    token: req.token,
                    name: req.name
                }
                return cb(null)
            },
            function (cb) {
                var requestData = {
                    url: Config.slack.apiURL + req.methodeName,
                    form: dataHolder.requestData
                };

                dataHolder.workSpaceData = {};

                apiRequest(requestData).then((workSpaceData) => {
                    dataHolder.workSpaceData.wsUrl = workSpaceData.url;
                    dataHolder.workSpaceData.self = workSpaceData.self;
                    dataHolder.workSpaceData.team = workSpaceData.team;
                    dataHolder.workSpaceData.channels = workSpaceData.channels;
                    dataHolder.workSpaceData.users = workSpaceData.users;
                    dataHolder.workSpaceData.ims = workSpaceData.ims;
                    dataHolder.workSpaceData.groups = workSpaceData.groups;

                    EventEmitter.emit('start');
                    return cb(null)

                }).catch(err => {
                    console.log(err)
                    // return cb(err)
                })                
            },
        ], function (err) {
            if (err)
                return callback(err)
            
            return callback(null, dataHolder)
        })
    }
}



