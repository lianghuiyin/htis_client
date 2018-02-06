/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var tracenewsRouter = express.Router();

  tracenewsRouter.get('/', function(req, res) {
    res.send({
      'tracenews': []
    });
  });

  tracenewsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var tracesLen = app.traces.length;
    var trace = {};
    var tracenew = req.body.tracenew;
    var isSuc = false;
    var errorMsg = "油品过多";
    // var preTrace = app.traces.find(function(item) {
    //   return parseInt(item.Id) == parseInt(tracenew.PreviousTrace);
    // });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) == parseInt(tracenew.Instance);
    });
    console.log(instance);
    if(tracenew.Oils.length != 4){
      isSuc = true;
    }
    if(instance.IsArchived === true){
      errorMsg = "该申请单已归档，不能修改";
      isSuc = false;
    }
    if(instance.IsPending === true){
      errorMsg = "该申请单处于待审核状态，不能修改申请单，如果需要修改，请先取回该申请单";
      isSuc = false;
    }
    
    if(isSuc){
      trace.Id = tracesLen + 1;
      trace.Car = tracenew.Car;
      trace.Instance = tracenew.Instance;
      trace.PreviousTrace = tracenew.PreviousTrace;
      trace.Status = tracenew.Status;
      trace.IsFinished = false;
      trace.IsArchived = false;
      trace.Project = tracenew.Project;
      trace.Department = tracenew.Department;
      trace.UserName = tracenew.UserName;
      trace.Oils = tracenew.Oils;
      trace.Goal = tracenew.Goal;
      trace.StartDate = tracenew.StartDate;
      trace.EndDate = tracenew.EndDate;
      trace.StartInfo = tracenew.StartInfo;
      trace.EndInfo = '';
      trace.Creater = tracenew.Creater;
      trace.CreatedDate = new Date();
      trace.Modifier = tracenew.Creater;
      trace.ModifiedDate = new Date();
      app.traces.push(trace);

      console.log(tracenew.Status);
      //申请单可能已发布也可能未发布、可能处于启用也可能处于禁用状态、但一定不可能处于待审核状态（因为需要取回才能修改）
      if(tracenew.Status === "pending"){
        console.log("pending----");
        //需要重新提交审核，所以这里不可能把trace的内容同步到instance中
        instance.IsPending = true;
        instance.IsEnable = true;//如果申请单事先被禁用，则提交申请时需要自动启用
        instance.Modifier = tracenew.Creater;
        instance.ModifiedDate = new Date();
      }
      else{
        console.log("not-pending----");
        //这里需要再次验证下是否修改过敏感信息，来check是否真的不需要提交审核
        //只是修改的话，就直接结束当前trace
        trace.IsFinished = true;
        //直接把trace内容同步到instalce即可，不需要重新提交审核，也不需要更改申请单的发布及启用禁用状态
        instance.Project = tracenew.Project;
        instance.Department = tracenew.Department;
        instance.UserName = tracenew.UserName;
        instance.Oils = tracenew.Oils;
        instance.Goal = tracenew.Goal;
        instance.StartDate = tracenew.StartDate;
        instance.EndDate = tracenew.EndDate;
        // instance.IsReleased = false;
        // instance.IsEnable = true;//如果申请单事先被禁用，这里只是修改不需要重新提交审核的情况下是不能自动启用申请单的
        // instance.IsPending = true;
        // instance.IsArchived = false;
        // instance.Creater = tracenew.Creater;
        // instance.CreatedDate = new Date();
        instance.Modifier = tracenew.Creater;
        instance.ModifiedDate = new Date();
      }

      var car = app.cars.find(function(item) {
        return parseInt(item.Id) === parseInt(tracenew.Car);
      });
      car.Modifier = tracenew.Creater;
      car.ModifiedDate = new Date();

      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Traces:app.traces,
          Cars:app.cars,
          SyncToken:new Date()
        },
        tracenew:tracenew
      });
    }
    else
    {
      var errors = {
        Oils:errorMsg,
        ServerSideError:errorMsg
      };
      res.status(422).send({ 'errors': errors});
    }
  });

  tracenewsRouter.get('/:id', function(req, res) {
    res.send({
      'tracenews': {
        id: req.params.id
      }
    });
  });

  tracenewsRouter.put('/:id', function(req, res) {
    res.send({
      'tracenews': {
        id: req.params.id
      }
    });
  });

  tracenewsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/tracenews', require('body-parser'));
  app.use('/api/tracenews', tracenewsRouter);
};
