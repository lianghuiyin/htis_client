/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.



  var bowerPath = 'bower_components/';

  var bsPath = bowerPath + 'bootstrap';
  app.import(bsPath + '/dist/css/bootstrap.css');
  app.import(bsPath + '/dist/js/bootstrap.js');

  var datapickerPath = bowerPath + 'datapicker';
  app.import(datapickerPath + '/css/datepicker.css');
  // app.import(datapickerPath + '/css/layout.css');
  app.import(datapickerPath + '/js/datepicker.js');
  app.import(datapickerPath + '/js/eye.js');
  app.import(datapickerPath + '/js/utils.js');
  // app.import(datapickerPath + '/js/layout.js');

  var jwtPath = bowerPath + 'jsrsasign';
  app.import(jwtPath + '/jsrsasign-4.1.4-all-min.js');
  app.import(jwtPath + '/ext/json-sans-eval-min.js');
  app.import(jwtPath + '/jws-3.2.min.js');

  var hoPath = bowerPath + 'ho';
  app.import(hoPath + '/ho.js',{
    type: 'vendor',
    prepend: true
  });
  app.import(hoPath + '/jquery.placeholder.js',{
    type: 'vendor'
  });
  app.import(hoPath + '/jquery.t2e.js',{
    type: 'vendor'
  }); 
  
  // var es6Path = bowerPath + 'es6-shim';
  // app.import(es6Path + '/es6-shim.js',{
  //   type: 'vendor',
  //   prepend: true
  // });

  var spinjsPath = bowerPath + 'spinjs';
  app.import(spinjsPath + '/spin.min.js',{
    type: 'vendor',
    prepend: true
  });


  var es5Path = bowerPath + 'es5-shim';
  app.import(es5Path + '/es5-shim.js',{
    type: 'vendor',
    prepend: true
  });
  
  var bsFonts = new Funnel(bsPath, {
    srcDir: '/fonts',
    include: ['**/*.*'],
    destDir: '/fonts'
  });

  var vendor = new Funnel('vendor', {
    srcDir: '/',
    destDir: '/'
  });
  
  return new Funnel(app.toTree([bsFonts,vendor]), {
    exclude: ['**/.gitkeep']
  });
  // return app.toTree();
};
