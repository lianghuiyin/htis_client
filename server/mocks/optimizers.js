/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var optimizersRouter = express.Router();

  optimizersRouter.get('/', function(req, res) {
    res.send({
      'optimizers': []
    });
  });

  optimizersRouter.post('/', function(req, res) {
    var isSuc = true;
    if(isSuc){
      res.send({
        'optimizers': {
          Id: 1,
          AllCarsCount:220,
          ArchivedCarsCount:10,
          ArchivedInstancesCount:0
        }
      });
    }
    else
    {
      var errors = {
        ServerSideError:'名称重复S'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  optimizersRouter.get('/:id', function(req, res) {
    var isSuc = false;
    if(isSuc){
      res.send({
        'optimizers': {
          Id: 1,
          AllCarsCount:220,
          ArchivedCarsCount:2,
          ArchivedInstancesCount:1
        }
      });
    }
    else
    {
      var errors = {
        ServerSideError:'名称重复S'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  optimizersRouter.put('/:id', function(req, res) {
    res.send({
      'optimizers': {
        id: req.params.id
      }
    });
  });

  optimizersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/optimizers', require('body-parser'));
  app.use('/api/optimizers', optimizersRouter);
};
