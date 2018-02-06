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
  var instanceforbidsRouter = express.Router();

  instanceforbidsRouter.get('/', function(req, res) {
    res.send({
      'instanceforbids': []
    });
  });

  instanceforbidsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instanceforbid = req.body.instanceforbid;
    var isSuc = false;
    var errMsg = "网络不给力";
    var trace = {};
    var tracesLen = app.traces.length;
    var preTrace = app.traces.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceforbid.Trace);
    });
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceforbid.Car);
    });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(instanceforbid.Instance);
    });

    if(instanceforbid.StartInfo.indexOf("error") < 0){
      isSuc = true;
    }

    if(instance.IsPending){
      isSuc = false;
      errMsg = "该申请单处于待审核状态，不能禁用";
    }
    else if(!instance.IsReleased){
      isSuc = false;
      errMsg = "该申请单处于未发布状态，不能禁用";
    }
    else if(instance.IsArchived){
      isSuc = false;
      errMsg = "该申请单已被归档，不能禁用";
    }
    else if(!instance.IsEnable){
      isSuc = false;
      errMsg = "该申请单已被禁用，不能重复禁用";
    }
    else if(!preTrace.IsFinished){
      isSuc = false;
      errMsg = "该申请单最后一个履历处于未完成状态，不能禁用";
    }

    console.log(isSuc);
    
    if(isSuc){
      trace.Id = tracesLen + 1;
      trace.Car = instance.Car;
      trace.Instance = instanceforbid.Instance;
      trace.PreviousTrace = instanceforbid.Trace;
      trace.Status = instanceforbid.Status;
      trace.IsFinished = true;
      trace.IsArchived = false;
      trace.Project = instance.Project;
      trace.Department = instance.Department;
      trace.UserName = instance.UserName;
      trace.Oils = instance.Oils;
      trace.Goal = instance.Goal;
      trace.StartDate = instance.StartDate;
      trace.EndDate = instance.EndDate;
      trace.StartInfo = instanceforbid.StartInfo;
      trace.EndInfo = '';
      trace.Creater = instanceforbid.Creater;
      trace.CreatedDate = new Date();
      trace.Modifier = instanceforbid.Creater;
      trace.ModifiedDate = new Date();
      app.traces.push(trace);

      car.Modifier = instanceforbid.Creater;
      car.ModifiedDate = new Date();

      instance.IsEnable = false;
      instance.Modifier = instanceforbid.Creater
      instance.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instanceforbid:instanceforbid
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

  instanceforbidsRouter.get('/:id', function(req, res) {
    res.send({
      'instanceforbids': {
        id: req.params.id
      }
    });
  });

  instanceforbidsRouter.put('/:id', function(req, res) {
    res.send({
      'instanceforbids': {
        id: req.params.id
      }
    });
  });

  instanceforbidsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instanceforbids', require('body-parser'));
  app.use('/api/instanceforbids', instanceforbidsRouter);
};
