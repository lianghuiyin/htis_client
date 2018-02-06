/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var signaturesRouter = express.Router();

  signaturesRouter.get('/', function(req, res) {
    res.send({
      'signatures': []
    });
  });

  signaturesRouter.post('/', function(req, res) {
    var len = app.signatures.length;
    var signature = req.body.signature;
    var isSuc = false;
    var errMsg = "网络繁忙，请稍后再试";

    if(signature.Name.indexOf("error") < 0){
      isSuc = true;
    }
    if(isSuc){
      signature.Id = len + 1 + '';
      app.signatures.push(signature);
      res.status(201).send({ 'signature': signature });
    }
    else
    {
      var errors = {
        ServerSideError:errMsg
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  signaturesRouter.get('/:id', function(req, res) {
    res.send({
      'signatures': {
        id: req.params.id
      }
    });
  });

  signaturesRouter.put('/:id', function(req, res) {
    res.send({
      'signatures': {
        id: req.params.id
      }
    });
  });

  signaturesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/signatures', require('body-parser'));
  app.use('/api/signatures', signaturesRouter);
};
