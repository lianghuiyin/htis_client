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
  var instancenewsRouter = express.Router();

  instancenewsRouter.get('/', function(req, res) {
    res.send({
      'instancenews': []
    });
  });

  instancenewsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var instancesLen = app.instances.length;
    var tracesLen = app.traces.length;
    var instance = {};
    var trace = {};
    var instancenew = req.body.instancenew;
    var isSuc = false;
    // var repeats = roles.filter(function(item) {
    //   return item.Name == role.Name;
    // });
    if(instancenew.Oils.length != 4){
      isSuc = true;
    }
    
    if(isSuc){
      instance.Id = instancesLen + 1;
      instance.Car = instancenew.Car;
      instance.Project = instancenew.Project;
      instance.Department = instancenew.Department;
      instance.UserName = instancenew.UserName;
      instance.Oils = instancenew.Oils;
      instance.Goal = instancenew.Goal;
      instance.StartDate = instancenew.StartDate;
      instance.EndDate = instancenew.EndDate;
      instance.IsReleased = false;
      instance.IsEnable = true;
      instance.IsPending = true;
      instance.IsArchived = false;
      instance.BillCount = 0;
      instance.Creater = instancenew.Creater;
      instance.CreatedDate = new Date();
      instance.Modifier = instancenew.Creater;
      instance.ModifiedDate = new Date();
      app.instances.push(instance);

      trace.Id = tracesLen + 1;
      trace.Car = instancenew.Car;
      trace.Instance = instance.Id;
      trace.PreviousTrace = null;
      trace.Status = 'pending';
      trace.IsFinished = false;
      trace.IsArchived = false;
      trace.Project = instancenew.Project;
      trace.Department = instancenew.Department;
      trace.UserName = instancenew.UserName;
      trace.Oils = instancenew.Oils;
      trace.Goal = instancenew.Goal;
      trace.StartDate = instancenew.StartDate;
      trace.EndDate = instancenew.EndDate;
      trace.StartInfo = instancenew.StartInfo;
      trace.EndInfo = '';
      trace.Creater = instancenew.Creater;
      trace.CreatedDate = new Date();
      trace.Modifier = instancenew.Creater;
      trace.ModifiedDate = new Date();
      app.traces.push(trace);

      var car = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(instancenew.Car);
      });
      car.IsArchived = false;
      car.InstanceCount = car.InstanceCount + 1;
      car.Modifier = instancenew.Creater;
      car.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        instancenew:instancenew
      });
    }
    else
    {
      var errors = {
        Oils:'油品过多',
        ServerSideError:'油品过多'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  instancenewsRouter.get('/:id', function(req, res) {
    res.send({
      'instancenews': {
        id: req.params.id
      }
    });
  });

  instancenewsRouter.put('/:id', function(req, res) {
    res.send({
      'instancenews': {
        id: req.params.id
      }
    });
  });

  instancenewsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/instancenews', require('body-parser'));
  app.use('/api/instancenews', instancenewsRouter);
};
