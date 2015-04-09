/*
 * web-interface
 * 
 *
 * Copyright (c) 2015 Mark Caulfield
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('web_interface', 'Provides a web interface for your grunt tasks listed in a yaml file', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            punctuation: '.',
            separator: ', '
        });


    });
};
