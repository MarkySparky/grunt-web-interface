# gwwwunt

> Provides a web interface for your grunt tasks listed in a yaml file. Lets you run grunt tasks from the web page and displays console output.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gwwwunt --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('web-gwwwunt');
```

## The "gwwwunt" task

### Overview
In your project's Gruntfile, add a section named `gwwwunt` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  web_interface: {
    options: {
      // Task-specific options go here.
        port: 3007,
        yamlPath: '.grunt/aliases.yaml',
        keepAlive: true
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.port
Type: `String`
Default value: `'3007'`

A string value that is used to do something with whatever.

#### options.yamlPath
Type: `String`
Default value: `'.grunt/aliases.yaml'`

A string value that is used to do something else with whatever else.


#### options.keepAlive
Type: `Boolean`
Default value: `false`


### Usage Examples

#### Default Options
In this example, the default options are used to read the yaml data fro the .grunt folder. So if you use `load-grunt-config` your tasks will be listed on http://localhost:3007

```js
grunt.initConfig({
  gwwwunt: {
    options: {},
    server: {
    },
  },
})
```

#### Custom Options
In this example, we are setting a custom port fir the web interface to 3008 and also running a keep-alive script to keep the server running.

```js
grunt.initConfig({
  gwwwunt: {
    options: {
      port: '3008',
      keepAlive: true
    },
    server: {
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Mark Caulfield. Licensed under the MIT license.
