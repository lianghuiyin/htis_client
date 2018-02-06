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
  var loginsRouter = express.Router();

  loginsRouter.get('/', function(req, res) {
    res.send({
      'logins': []
    });
  });

  loginsRouter.post('/', function(req, res) {
    var login = req.body.login;
    var info = app.users.find(function(user) {
      console.log(user.Phone);
      console.log(user.Password);
      console.log(login.LogName);
      console.log(login.LogPassword);
      return (user.Phone === login.LogName || user.Email === login.LogName) && user.Password === login.LogPassword;
    });
    login["Id"] = 1;
    login["LogPassword"] = '';
    if(info){
      if(info.IsEnable){
        login["IsPassed"] = 1;
        login["LogId"] = info.Id;
        res.status(201).send({ 'login': login });
      }
      else{
        login["IsPassed"] = 0;
        login["LogId"] = 0;
        var errors = {
          ServerSideError:'该用户已被禁用'
        };
        res.status(422).send({ 'errors': errors,'login': login });
      }
    }
    else{
      login["IsPassed"] = 0;
      login["LogId"] = 0;
      var errors = {
        ServerSideError:'用户名或密码错误'
      };
      res.status(422).send({ 'errors': errors,'login': login });
    }
  });

  loginsRouter.get('/:id', function(req, res) {
    res.send({
      'logins': {
        id: req.params.id
      }
    });
  });

  loginsRouter.put('/:id', function(req, res) {
    res.send({
      'logins': {
        id: req.params.id
      }
    });
  });

  loginsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/logins', loginsRouter);
};

