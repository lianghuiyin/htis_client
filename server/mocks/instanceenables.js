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
  var instanceenablesRouter = express.Router();

  instanceenablesRouter.get('/', function(req, res) {
    res.send({
      'instanceenables': []
    });
  });

  instanceenablesRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instanceenable = req.body.instanceenable;
    var isSuc = false;
    var errMsg = "网络不给力";
    var trace = {};
    var tracesLen = app.traces.length;
    var preTrace = app.traces.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceenable.Trace);
    });
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceenable.Car);
    });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceenable.Instance);
    });

    if(instanceenable.StartInfo.indexOf("error") < 0){
      isSuc = true;
    }

    if(instance.IsArchived){
      isSuc = false;
      errMsg = "该申请单已被归档，不能启用";
    }
    else if(instance.IsEnable){
      isSuc = false;
      errMsg = "该申请单已启用，不能重复启用";
    }
    else if(!preTrace.IsFinished){
      isSuc = false;
      errMsg = "该申请单最后一个履历处于未完成状态，不能启用";
    }

    console.log(isSuc);
    
    if(isSuc){
      trace.Id = tracesLen + 1;
      trace.Car = instance.Car;
      trace.Instance = instanceenable.Instance;
      trace.PreviousTrace = instanceenable.Trace;
      trace.Status = instanceenable.Status;
      trace.IsFinished = true;
      trace.IsArchived = false;
      trace.Project = instance.Project;
      trace.Department = instance.Department;
      trace.UserName = instance.UserName;
      trace.Oils = instance.Oils;
      trace.Goal = instance.Goal;
      trace.StartDate = instance.StartDate;
      trace.EndDate = instance.EndDate;
      trace.StartInfo = instanceenable.StartInfo;
      trace.EndInfo = '';
      trace.Creater = instanceenable.Creater;
      trace.CreatedDate = new Date();
      trace.Modifier = instanceenable.Creater;
      trace.ModifiedDate = new Date();
      app.traces.push(trace);

      car.Modifier = instanceenable.Creater;
      car.ModifiedDate = new Date();

      instance.IsEnable = true;
      instance.Modifier = instanceenable.Creater
      instance.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instanceenable:instanceenable
      });
    }
    else
    {
      var errors = {
        ServerSideError:errMsg
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  instanceenablesRouter.get('/:id', function(req, res) {
    res.send({
      'instanceenables': {
        id: req.params.id
      }
    });
  });

  instanceenablesRouter.put('/:id', function(req, res) {
    res.send({
      'instanceenables': {
        id: req.params.id
      }
    });
  });

  instanceenablesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instanceenables', require('body-parser'));
  app.use('/api/instanceenables', instanceenablesRouter);
};
