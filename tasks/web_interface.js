/*
 * web-interface
 * 
 *
 * Copyright (c) 2015 Mark Caulfield
 * Licensed under the MIT license.
 */

'use strict';
var express = require('express.io');
var app = express();
var exphbs = require('express-handlebars');
var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs');
require('shelljs/global');

module.exports = function(grunt) {


    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks


    grunt.registerMultiTask('web_interface', 'Provides a web interface for your grunt tasks listed in a yaml file', function() {

        var release = this.async();

        var router = express.Router(); // get an instance of the express Router

        // view engine setup
        app.set('views', path.join(__dirname + '', '/views'));
        app.engine('.hbs', exphbs({
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');

        app.use(express.static(__dirname + '/views/css'));


        app.get('/', function(req, res) {


            var tasks = [];

            // Get document, or throw exception on error
            try {
                var doc = yaml.safeLoad(fs.readFileSync('aliases.yaml', 'utf8'));
            } catch (e) {
                console.log(e);
            }

            for (var key in doc) {
                console.log(key);
                tasks.push({
                    name: key,
                    detail: doc[key]
                });
            }

            res.render('home', {
                tasks: tasks
            });
        });

        app.get('/grunt/:task', function(req, res) {


            var task = req.params.task;
            res.write('Running "Grunt ' + task + '"');
            // Run external tool synchronously
            var child = exec('grunt ' + task, {
                silent: false,
                async: true
            });
            child.stdout.on('data', function(data) {
                /* ... do something with data ... */
                res.write(data);
            });

            child.on('exit', function(code) {
                res.end(' - done');
            });



        });



        var server = app.listen(3007, function() {

            var host = server.address().address;
            var port = server.address().port;

            console.log('Server listening at http://%s:%s', host, port);

        });
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });


    });
};
