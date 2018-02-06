module.exports = function(app) {
  var express = require('express');
  var accountpwdsRouter = express.Router();

  accountpwdsRouter.get('/', function(req, res) {
    res.send({
      'accountpwds': []
    });
  });

  accountpwdsRouter.post('/', function(req, res) {
    console.log(req.body);
    var info = req.body.accountpwd;
    var isSuc = false;
    if(info.OldPassword == 'hhhhhh'){
      isSuc = true;
    }
    info.OldPassword = '';
    info.NewPassword = '';
    info.ConfirmPassword = '';
    // res.status(201).send({ 'accountpwd': info });
    if(isSuc){
      res.status(201).send({ 'accountpwd': info });
    }
    else
    {
      var errors = {
        server_side_error:'密码错误'
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  accountpwdsRouter.get('/:id', function(req, res) {
    res.send({
      'accountpwds': {
        id: req.params.id
      }
    });
  });

  accountpwdsRouter.put('/:id', function(req, res) {
    res.send({
      'accountpwds': {
        id: req.params.id
      }
    });
  });

  accountpwdsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/accountpwds', accountpwdsRouter);
};
