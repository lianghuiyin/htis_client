module.exports = function(app) {
  // server/mocks/roles.js
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
  var rolesRouter = express.Router();

  rolesRouter.get('/', function(req, res) {
    res.send({
      'roles': app.roles
    });
  });

  rolesRouter.post('/', function(req, res) {
    // res.status(201).end();
    var len = app.roles.length;
    var role = req.body.role;
    var isSuc = false;
    var repeats = app.roles.filter(function(item) {
      return item.Name == role.Name;
    });
    if(repeats.length == 0){
      isSuc = true;
    }
    if(isSuc){
      role.Id = len + 1;
      app.roles.push(role);
      res.status(201).send({ 'Changeset': {
          Roles:app.roles,
          SyncToken:new Date()
        },
        'Role': role 
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

  rolesRouter.get('/:id', function(req, res) {
    // res.send({
    //   'roles': {
    //     id: req.params.id
    //   }
    // });
    res.send({
      'roles': app.roles.find(function(role) {
        return role.id === req.params.id;
      })
    });
  });

  rolesRouter.put('/:id', function(req, res) {
    // res.send({
    //   'roles': {
    //     id: req.params.id
    //   }
    // });
      var info = app.roles.find(function(role) {
        return role.Id == req.params.id;
      });

      var role = req.body.role;
      role.Id = req.params.id;
      var isSuc = false;
      if(role.Name.indexOf("error") < 0){
        var repeats = app.roles.filter(function(item) {
          return item.Name == role.Name && parseInt(item.Id) !== parseInt(req.params.id);
        });
        if(repeats.length == 0){
          isSuc = true;
        }
      }
      if(isSuc){
        info.Name = role.Name;
        info.ModifiedDate = new Date();
        info.Powers = role.Powers;
        res.send({ 'Changeset': {
            Roles:app.roles,
            SyncToken:new Date()
          },
          Role:info
        });
      }
      else
      {
        var errors = {
          ServerSideError:'名称重复'
        };
        res.status(422).send({ 'errors': errors});
      }
  });

  rolesRouter.delete('/:id', function(req, res) {
        var errors = {
          ServerSideError:'有关联数据不能删除'
        };
        res.status(422).send({ 'errors': errors});
    // var index = -1;
    // var temp = false;
    // app.roles.forEach(function(role) {
    //   if(temp){
    //     return;
    //   }
    //   ++index;
    //   temp = parseInt(role.Id) === parseInt(req.params.id);
    // });
    // app.roles.splice(index,1);
    // app.deletes.push({
    //   Id:1,
    //   Model:"Role",
    //   TargetIds:"6",
    //   CreatedDate:(new Date())
    // });
    // res.status(204).end();
  });

  app.use('/api/roles', rolesRouter);
};
