module.exports = function(app) {
  // server/mocks/users.js
  // form MDN. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find

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
  var usersRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    res.send({
      'users': users
    });
  });

  usersRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.users.length;
    user = req.body.user;
    user.Id = len + 1;
    user.Password = "hhhhhh";
    app.users.push(user);
    res.status(201).send({ 'user': user });
  });

  usersRouter.get('/:id', function(req, res) {
    // res.send({
    //   'users': {
    //     id: req.params.id
    //   }
    // });
    res.send({
      'users': app.users.find(function(user) {
        return user.id === req.params.id;
      })
    });
  });

  usersRouter.put('/:id', function(req, res) {
    // res.send({
    //   'users': {
    //     id: req.params.id
    //   }
    // });
      var info = app.users.find(function(user) {
        return user.Id == req.params.id;
      });

      var user = req.body.user;
      user.Id = req.params.id;
      var isSuc = false;
      if(user.Name.indexOf("error") < 0){
        var repeats = app.users.filter(function(item) {
          return item.Name == user.Name && parseInt(item.Id) !== parseInt(req.params.id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
      }
      if(isSuc){
        info.Name = user.Name;
        info.ModifiedDate = new Date();
        info.Role = user.Role;
        info.IsEnable = user.IsEnable;
        info.IsSignNeeded = user.IsSignNeeded;
        info.IsPrintable = user.IsPrintable;
        info.PrinterAddr = user.PrinterAddr;
        res.send({ 'Changeset': {
            Users:app.users,
            SyncToken:new Date()
          },
          user:info
        });
      }
      else
      {
        var errors = {
          Name:'名称重复',
          ServerSideError:'名称重复S'
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  usersRouter.delete('/:id', function(req, res) {
    // res.status(204).end();
    var index = -1;
    var temp = false;
    app.users.forEach(function(user) {
      if(temp){
        return;
      }
      ++index;
      temp = parseInt(user.Id) === parseInt(req.params.id);
    });
    app.users.splice(index,1);

    app.deleteds.push({
      Id:1,
      Model:"User",
      TargetIds:req.params.id,
      CreatedDate:(new Date())
    });
    res.status(204).end();
  });

  app.use('/api/users', usersRouter);
};
