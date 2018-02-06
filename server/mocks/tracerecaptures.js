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
  var tracerecapturesRouter = express.Router();

  tracerecapturesRouter.get('/', function(req, res) {
    res.send({
      'tracerecaptures': []
    });
  });

  tracerecapturesRouter.post('/', function(req, res) {
    // res.status(201).end();
    var tracerecapture = req.body.tracerecapture;
    var isSuc = false;
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(tracerecapture.Instance);
    });
    var trace = app.traces.find(function(item) {
      return parseInt(item.Id) === parseInt(tracerecapture.Trace);
    });

    console.log(tracerecapture.Instance);

    if(tracerecapture.EndInfo.toString() !== "errors"){
      isSuc = true;
    }
    console.log(isSuc);
    
    if(isSuc){
      trace.Status = "recaptured";
      trace.IsFinished = true;
      trace.EndInfo = tracerecapture.EndInfo;
      trace.Modifier = tracerecapture.Creater
      trace.ModifiedDate = new Date();

      instance.IsPending = false;
      instance.Modifier = tracerecapture.Creater
      instance.ModifiedDate = new Date();

      var car = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(tracerecapture.Car);
      });
      car.Modifier = tracerecapture.Creater;
      car.ModifiedDate = new Date();
      
      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        tracerecapture:tracerecapture
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

  tracerecapturesRouter.get('/:id', function(req, res) {
    res.send({
      'tracerecaptures': {
        id: req.params.id
      }
    });
  });

  tracerecapturesRouter.put('/:id', function(req, res) {
    res.send({
      'tracerecaptures': {
        id: req.params.id
      }
    });
  });

  tracerecapturesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tracerecaptures', require('body-parser'));
  app.use('/api/tracerecaptures', tracerecapturesRouter);
};
