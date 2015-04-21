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
            yamlPath: '.grunt/aliases.yaml'
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

            grunt.event.emit('socketio', 'taskupdate', {
                msg: 'broadcasting'
            });



            var child = exec('grunt ' + task, {
                silent: false,
                async: true
            });

            child.stdout.on('data', function(data) {
                grunt.event.emit('socketio', 'taskupdate', {
                    msg: data
                });
            });

        });

        server.listen(options.port, function() {

            var host = server.address().address;
            var port = server.address().port;

            console.log('Server listening at http://%s:%s', host, port);

        });
    });
};
