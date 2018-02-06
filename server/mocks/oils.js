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
  var oilsRouter = express.Router();

  oilsRouter.get('/', function(req, res) {
    res.send({
      'oils': []
    });
  });

  oilsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.oils.length;
    oil = req.body.oil;
    var isSuc = false;
    var repeats = app.oils.filter(function(item) {
      return item.Name == oil.Name;
    });
    if(repeats.length == 0){
      isSuc = true;
    }
    if(isSuc){
      oil.Id = len + 1 + '';
      app.oils.push(oil);
      res.status(201).send({ 'oil': oil });
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

  oilsRouter.get('/:id', function(req, res) {
    res.send({
      'oils': {
        id: req.params.id
      }
    });
  });

  oilsRouter.put('/:id', function(req, res) {
    // res.send({
    //   'oils': {
    //     id: req.params.id
    //   }
    // });
      var info = app.oils.find(function(oil) {
        return oil.Id == req.params.id;
      });

      var oil = req.body.oil;
      oil.Id = req.params.id;
      var isSuc = false;
      if(oil.Name.indexOf("error") < 0){
        var repeats = app.oils.filter(function(item) {
          return item.Name == oil.Name && parseInt(item.Id) !== parseInt(req.params.id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
      }
      if(isSuc){
        info.Name = oil.Name;
        info.YellowRate = oil.YellowRate;
        info.RedRate = oil.RedRate;
        info.ModifiedDate = new Date();
        res.send({ 'oils': oil });
      }
      else
      {
        var errors = {
          ServerSideError:'名称重复'
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  oilsRouter.delete('/:id', function(req, res) {
    // res.status(204).end();
    var index = -1;
    var temp = false;
    app.oils.forEach(function(oil) {
      if(temp){
        return;
      }
      ++index;
      temp = parseInt(oil.Id) === parseInt(req.params.id);
    });
    app.oils.splice(index,1);

    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/oils', require('body-parser'));
  app.use('/api/oils', oilsRouter);
};
