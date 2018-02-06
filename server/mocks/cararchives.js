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
  var cararchivesRouter = express.Router();

  cararchivesRouter.get('/', function(req, res) {
    res.send({
      'cararchives': []
    });
  });

  cararchivesRouter.post('/', function(req, res) {
    // res.status(201).end();
    var cararchive = req.body.cararchive;
    var isSuc = false;
    var errMsg = "网络不给力";
    var instances = app.instances.filter(function(item) {
      return parseInt(item.Car) === parseInt(cararchive.Car) && item.IsArchived === false;
    });
    if(instances.length > 0){
      errMsg = "该车辆下有申请单没有归档，不能归档该车辆";
    }
    else{
      isSuc = true;
    }

    // isSuc = false;
    
    console.log(isSuc);
    
    if(isSuc){
      var car = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(cararchive.Car);
      });
      car.IsArchived = true;
      car.Modifier = cararchive.Creater;
      car.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Cars:app.cars,
          SyncToken:new Date()
        },
        cararchive:cararchive
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

  cararchivesRouter.get('/:id', function(req, res) {
    res.send({
      'cararchives': {
        id: req.params.id
      }
    });
  });

  cararchivesRouter.put('/:id', function(req, res) {
    res.send({
      'cararchives': {
        id: req.params.id
      }
    });
  });

  cararchivesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/cararchives', require('body-parser'));
  app.use('/api/cararchives', cararchivesRouter);
};
