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
  var instancechecksRouter = express.Router();

  instancechecksRouter.get('/', function(req, res) {
    res.send({
      'instancechecks': []
    });
  });

  instancechecksRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instancecheck = req.body.instancecheck;
    var isSuc = false;
    var errMsg = "网络不给力";
    var trace = app.traces.find(function(item) {
      return parseInt(item.Id) === parseInt(instancecheck.Trace);
    });
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(instancecheck.Car);
    });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(instancecheck.Instance);
    });

    if(instancecheck.EndInfo.indexOf("error") < 0){
      isSuc = true;
    }

    if(!instance.IsPending){
      isSuc = false;
      errMsg = "该申请单处于非待审核状态，可能已被其他人审核或已被申请人取回，不能重复审核";
    }
    else if(instance.IsArchived){
      isSuc = false;
      errMsg = "该申请单已被归档，不能审核";
    }
    else if(!instance.IsEnable){
      isSuc = false;
      errMsg = "该申请单已被禁用，不能审核";
    }
    else if(trace.IsFinished){
      isSuc = false;
      errMsg = "该申请单已被其他人审核过了，不能重复审核";
    }

    console.log(isSuc);
    
    if(isSuc){
      trace.IsFinished = true;
      trace.Status = instancecheck.Status;
      trace.EndInfo = instancecheck.EndInfo;
      trace.Modifier = instancecheck.Creater;
      trace.ModifiedDate = new Date();

      car.Modifier = instancecheck.Creater;
      car.ModifiedDate = new Date();

      if(instancecheck.Status == "approved"){
        instance.IsReleased = true;
        instance.Car = trace.Car;
        instance.Project = trace.Project;
        instance.Department = trace.Department;
        instance.UserName = trace.UserName;
        instance.Oils = trace.Oils;
        instance.Goal = trace.Goal;
        instance.StartDate = trace.StartDate;
        instance.EndDate = trace.EndDate;
      }
      instance.IsPending = false;
      instance.Modifier = instancecheck.Creater
      instance.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instancecheck:instancecheck
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

  instancechecksRouter.get('/:id', function(req, res) {
    res.send({
      'instancechecks': {
        id: req.params.id
      }
    });
  });

  instancechecksRouter.put('/:id', function(req, res) {
    res.send({
      'instancechecks': {
        id: req.params.id
      }
    });
  });

  instancechecksRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instancechecks', require('body-parser'));
  app.use('/api/instancechecks', instancechecksRouter);
};
