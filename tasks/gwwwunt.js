/*
 * web-interface
 * 
 *
 * Copyright (c) 2015 Mark Caulfield
 * Licensed under the MIT license.
 */

'use strict';
var app = require('express')();
var server = require('http').createServer(app);
//var io = require('socket.io-client')('http://localhost:3009');

var ioClient = require('socket.io-client');


var exphbs = require('express-handlebars');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
require('shelljs/global');
//var router = express.Router(); // get an instance of the express Router

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('gwwwunt', 'Provides a web interface for your grunt tasks listed in a yaml file', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            port: '3007',
            yamlPath: '.grunt/aliases.yaml',
            socketIOEndpoint: 'http://localhost:3079'
        });

        var io = ioClient(options.socketIOEndpoint);

        // Add a connect listener
        io.on('connection', function(client) {
            console.log('Connection to client established');

            // Success!  Now listen to messages to be received
            client.on('message', function(event) {
                console.log('Received message from client!', event);
            });

            client.on('disconnect', function() {
                console.log('Server has disconnected');
            });
        });



        if (options.keepAlive === true) {
            this.async();
        }

        // view engine setup
        app.set('views', path.join(__dirname + '', '/views'));
        app.engine('.hbs', exphbs({
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');

        //app.use(express.static(__dirname + '/views/css'));

        app.get('/', function(req, res) {

            var tasks = [];
            var doc;


            // Get document, or throw exception on error
            try {
                doc = yaml.safeLoad(fs.readFileSync(options.yamlPath, 'utf8'));
            } catch (e) {
                console.log(e);
            }

            //Loop through all the yaml keyss adding to array
            for (var key in doc) {
                tasks.push({
                    name: escape(key),
                    detail: doc[key]
                });
            }

            res.render('index', {
                tasks: tasks
            });
        });

        app.get('/task/:task', function(req, res) {

            var task = req.params.task;

            res.render('task', {
                name: task
            });

            io.emit('taskupdate', 'broadcasting');

             var child = exec('grunt ' + task, {
                 silent: false,
                 async: true
             });

             child.stdout.on('data', function(data) {
                 io.emit('taskupdate', {msg: data});
             });

        });


        io.on('connection', function() { /* … */ });

        server.listen(options.port, function() {

            var host = server.address().address;
            var port = server.address().port;

            console.log('Server listening at http://%s:%s', host, port);

        });
    });
};
