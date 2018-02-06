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
  var departmentsRouter = express.Router();
  
  departmentsRouter.get('/', function(req, res) {
    res.send({
      'departments': []
    });
  });

  departmentsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.departments.length;
    department = req.body.department;
    var isSuc = false;
    var repeats = app.departments.filter(function(item) {
      return item.Name == department.Name;
    });
    if(repeats.length == 0){
      isSuc = true;
    }
    if(isSuc){
      department.Id = len + 1 + '';
      app.departments.push(department);
      res.status(201).send({ 'departments': department });
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

  departmentsRouter.get('/:id', function(req, res) {
    res.send({
      'departments': {
        id: req.params.id
      }
    });
  });

  departmentsRouter.put('/:id', function(req, res) {
    // res.send({
    //   'departments': {
    //     id: req.params.id
    //   }
    // });
      var info = app.departments.find(function(department) {
        return department.Id == req.params.id;
      });

      var department = req.body.department;
      department.Id = req.params.id;
      var isSuc = false;
      if(department.Name.indexOf("error") < 0){
        var repeats = app.departments.filter(function(item) {
          return item.Name == department.Name && parseInt(item.Id) !== parseInt(req.params.id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
      }
      if(isSuc){
        info.Name = department.Name;
        info.ModifiedDate = new Date();
        res.send({ 'departments': department });
      }
      else
      {
        var errors = {
          ServerSideError:'名称重复'
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  departmentsRouter.delete('/:id', function(req, res) {
    // res.status(204).end();
    var index = -1;
    var temp = false;
    app.departments.forEach(function(department) {
      if(temp){
        return;
      }
      ++index;
      temp = parseInt(department.Id) === parseInt(req.params.id);
    });
    app.departments.splice(index,1);

    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/departments', require('body-parser'));
  app.use('/api/departments', departmentsRouter);
};
