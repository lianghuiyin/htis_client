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
  var instancearchivesRouter = express.Router();

  instancearchivesRouter.get('/', function(req, res) {
    res.send({
      'instancearchives': []
    });
  });

  instancearchivesRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instancearchive = req.body.instancearchive;
    var isSuc = false;
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(instancearchive.Instance);
    });
    var traces = app.traces.filter(function(item) {
      return instancearchive.Traces.find(function(n){
        return n === item.Id.toString();
      });
    });
    console.log(traces);


    isSuc = true;
    console.log(isSuc);
    
    if(isSuc){
      traces.forEach(function(item){
        item.IsArchived = true;
        item.Modifier = instancearchive.Creater
        item.ModifiedDate = new Date();
      });

      instance.IsArchived = true;
      instance.Modifier = instancearchive.Creater
      instance.ModifiedDate = new Date();
      
      var car = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(instancearchive.Car);
      });
      car.Modifier = instancearchive.Creater;
      car.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instancearchive:instancearchive
      });
    }
    else
    {
      var errors = {
        ServerSideError:'网络不给力'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  instancearchivesRouter.get('/:id', function(req, res) {
    res.send({
      'instancearchives': {
        id: req.params.id
      }
    });
  });

  instancearchivesRouter.put('/:id', function(req, res) {
    res.send({
      'instancearchives': {
        id: req.params.id
      }
    });
  });

  instancearchivesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instancearchives', require('body-parser'));
  app.use('/api/instancearchives', instancearchivesRouter);
};
