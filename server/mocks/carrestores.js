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
  var carrestoresRouter = express.Router();

  carrestoresRouter.get('/', function(req, res) {
    res.send({
      'carrestores': []
    });
  });

  carrestoresRouter.post('/', function(req, res) {
    // res.status(201).end();
    var carrestore = req.body.carrestore;
    var isSuc = false;
    var errMsg = "网络不给力";
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(carrestore.Car);
    });
    if(car.IsArchived){
      isSuc = true;
    }

    console.log(isSuc);
    
    if(isSuc){
      car.IsArchived = false;
      car.Modifier = carrestore.Creater;
      car.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Cars:app.cars,
          SyncToken:new Date()
        },
        carrestore:carrestore
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

  carrestoresRouter.get('/:id', function(req, res) {
    res.send({
      'carrestores': {
        id: req.params.id
      }
    });
  });

  carrestoresRouter.put('/:id', function(req, res) {
    res.send({
      'carrestores': {
        id: req.params.id
      }
    });
  });

  carrestoresRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/carrestores', require('body-parser'));
  app.use('/api/carrestores', carrestoresRouter);
};
