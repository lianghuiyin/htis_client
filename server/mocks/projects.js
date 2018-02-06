/*jshint node:true*/
module.exports = function(app) {

  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(predicate) {
        if (this == null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          if (i in list) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
              return value;
            }
          }
        }
        return undefined;
      }
    });
  }

  var express = require('express');
  var projectsRouter = express.Router();

  projectsRouter.get('/', function(req, res) {
    res.send({
      'projects': []
    });
  });

  projectsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.projects.length;
    project = req.body.project;
    var isSuc = false;
    var repeats = app.projects.filter(function(item) {
      return item.Name == project.Name;
    });
    if(repeats.length == 0){
      isSuc = true;
    }
    if(isSuc){
      project.Id = len + 1 + '';
      app.projects.push(project);
      res.status(201).send({ 'project': project });
    }
    else
    {
      var errors = {
        Name:'名称重复',
        ServerSideError:'名称重复S'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  projectsRouter.get('/:id', function(req, res) {
    res.send({
      'projects': {
        id: req.params.id
      }
    });
  });

  projectsRouter.put('/:id', function(req, res) {
    // res.send({
    //   'projects': {
    //     id: req.params.id
    //   }
    // });

      var info = app.projects.find(function(project) {
        return project.Id == req.params.id;
      });

      var project = req.body.project;
      project.Id = req.params.id;
      var isSuc = false;
      if(project.Name.indexOf("error") < 0){
        var repeats = app.projects.filter(function(item) {
          return item.Name == project.Name && parseInt(item.Id) !== parseInt(req.params.id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
      }
      if(isSuc){
        info.Name = project.Name;
        info.ModifiedDate = new Date();
        res.send({ 'projects': project });
      }
      else
      {
        var errors = {
          ServerSideError:'名称重复'
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  projectsRouter.delete('/:id', function(req, res) {
    // res.status(204).end();
    var index = -1;
    var temp = false;
    app.projects.forEach(function(project) {
      if(temp){
        return;
      }
      ++index;
      temp = parseInt(project.Id) === parseInt(req.params.id);
    });
    app.projects.splice(index,1);

    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/project', require('body-parser'));
  app.use('/api/projects', projectsRouter);
};
