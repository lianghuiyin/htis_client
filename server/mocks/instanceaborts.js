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
  var instanceabortsRouter = express.Router();

  instanceabortsRouter.get('/', function(req, res) {
    res.send({
      'instanceaborts': []
    });
  });

  instanceabortsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instanceabort = req.body.instanceabort;
    var isSuc = false;
    var errMsg = "网络不给力";
    var trace = {};
    var tracesLen = app.traces.length;
    var preTrace = app.traces.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceabort.Trace);
    });
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceabort.Car);
    });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceabort.Instance);
    });

    if(instanceabort.StartInfo.indexOf("error") < 0){
      isSuc = true;
    }

    if(instance.IsPending){
      isSuc = false;
      errMsg = "该申请单处于待审核状态，不能中止";
    }
    else if(instance.IsArchived){
      isSuc = false;
      errMsg = "该申请单已被归档，不能中止";
    }
    else if(!instance.IsEnable){
      isSuc = false;
      errMsg = "该申请单已被禁用，不能中止";
    }
    else if(!preTrace.IsFinished){
      isSuc = false;
      errMsg = "该申请单最后一个履历处于未完成状态，不能中止";
    }

    console.log(isSuc);
    
    if(isSuc){
      trace.Id = tracesLen + 1;
      trace.Car = instance.Car;
      trace.Instance = instanceabort.Instance;
      trace.PreviousTrace = instanceabort.Trace;
      trace.Status = instanceabort.Status;
      trace.IsFinished = true;
      trace.IsArchived = false;
      trace.Project = instance.Project;
      trace.Department = instance.Department;
      trace.UserName = instance.UserName;
      trace.Oils = instance.Oils;
      trace.Goal = instance.Goal;
      trace.StartDate = instance.StartDate;
      trace.EndDate = instance.EndDate;
      trace.StartInfo = instanceabort.StartInfo;
      trace.EndInfo = '';
      trace.Creater = instanceabort.Creater;
      trace.CreatedDate = new Date();
      trace.Modifier = instanceabort.Creater;
      trace.ModifiedDate = new Date();
      app.traces.push(trace);

      car.Modifier = instanceabort.Creater;
      car.ModifiedDate = new Date();

      instance.IsReleased = false;
      instance.Modifier = instanceabort.Creater
      instance.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instanceabort:instanceabort
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

  instanceabortsRouter.get('/:id', function(req, res) {
    res.send({
      'instanceaborts': {
        id: req.params.id
      }
    });
  });

  instanceabortsRouter.put('/:id', function(req, res) {
    res.send({
      'instanceaborts': {
        id: req.params.id
      }
    });
  });

  instanceabortsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instanceaborts', require('body-parser'));
  app.use('/api/instanceaborts', instanceabortsRouter);
};
