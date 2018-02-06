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
  var carsRouter = express.Router();

  carsRouter.get('/', function(req, res) {
    var key = req.query.key;
    var repeats = app.cars;
    if(key){
      repeats = app.cars.filter(function(item) {
        return item.Number === key || item.Vin === key;
      });
    }
    res.send({
      'cars': repeats
    });
  });

  carsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.cars.length;
    var car = req.body.car;
    var isSuc = false;
    var errMsg = "网络繁忙，请稍后再试";

    if(car.Number.indexOf("error") < 0){
      var repeats = app.cars.filter(function(item) {
        return item.Number === car.Number || item.Vin === car.Vin;
      });
      if(repeats.length === 0){
        isSuc = true;
      }
      else{
        errMsg = "内部编号或VIN码重复";
      }
    }
    if(isSuc){
      car.Id = len + 1 + '';
      app.cars.push(car);
      res.status(201).send({ 'car': car });
    }
    else
    {
      var errors = {
        ServerSideError:errMsg
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  carsRouter.get('/:id', function(req, res) {
    res.send({
      'cars': {
        id: req.params.id
      }
    });
  });

  carsRouter.put('/:id', function(req, res) {
      var car = req.body.car;
      car.Id = req.params.id;
      var errMsg = "网络繁忙，请稍后再试";
      var info = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(car.Id);
      });
      var isSuc = false;
      if(car.Number.indexOf("error") < 0){
        var repeats = app.cars.filter(function(item) {
          return item.Number === car.Number && parseInt(item.Id) !== parseInt(car.Id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
        else{
          errMsg = "内部编号或VIN码重复";
        }
      }
      if(isSuc){
        info.Number = car.Number;
        info.Vin = car.Vin;
        info.Model = car.Model;
        info.Description = car.Description;
        info.ModifiedDate = new Date();
        res.send({ 'cars': car });
      }
      else
      {
        var errors = {
          ServerSideError:errMsg
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  carsRouter.delete('/:id', function(req, res) {
    // res.status(204).end();
    var index = -1;
    var temp = false;
    app.cars.forEach(function(car) {
      if(temp){
        return;
      }
      ++index;
      temp = parseInt(car.Id) === parseInt(req.params.id);
    });
    app.cars.splice(index,1);

    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/cars', require('body-parser'));
  app.use('/api/cars', carsRouter);
};
