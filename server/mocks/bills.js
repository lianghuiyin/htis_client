/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var billsRouter = express.Router();

  billsRouter.get('/', function(req, res) {
    res.send({
      'bills': []
    });
  });

  billsRouter.post('/', function(req, res) {
    // res.status(201).end();
    var bill = req.body.bill;
    var isSuc = false;
    var errMsg = "网络不给力";
    var billsLen = app.bills.length;
    var car = app.cars.find(function(item) {
      return parseInt(item.Id) === parseInt(bill.Car);
    });
    var instance = app.instances.find(function(item) {
      return parseInt(item.Id) === parseInt(bill.Instance);
    });

    isSuc = true;

    if(instance.IsArchived){
      isSuc = false;
      errMsg = "该申请单已被归档，不能加油";
    }
    else if(!instance.IsEnable){
      isSuc = false;
      errMsg = "该申请单已被禁用，不能加油";
    }
    else if(!instance.IsReleased){
      isSuc = false;
      errMsg = "该申请单未核准，不能加油";
    }
    //这里要根据instance.StartDate、EndDate及当前时间来判断是否申请单已过期，过期的申请单不能加油

    if(bill.Mileage > 100){

      isSuc = false;
      errMsg = "里程数重复";

    }
    console.log(isSuc);
    
    if(isSuc){
      bill.Id = billsLen + 1;
      bill.PreviousOil = car.LastOil;
      bill.Time = new Date();
      bill.Creater = bill.Creater;
      bill.CreatedDate = new Date();
      bill.Modifier = bill.Creater;
      bill.ModifiedDate = new Date();
      app.bills.push(bill);

      instance.BillCount = instance.BillCount + 1;
      instance.Modifier = bill.Creater;
      instance.ModifiedDate = new Date();

      car.BillCount = car.BillCount + 1;
      car.PreviousOil = car.LastOil;
      car.LastOil = bill.Oil;
      car.LastVolume = bill.Volume;
      car.LastMileage = bill.Mileage;
      car.LastRate = bill.Rate;
      car.Modifier = bill.Creater;
      car.ModifiedDate = new Date();


      res.status(201).send({ 'Changeset': {
          Instances:app.instances,
          Cars:app.cars,
          Bills:app.bills,
          SyncToken:new Date()
        },
        bill:bill
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

  billsRouter.get('/:id', function(req, res) {
    res.send({
      'bills': {
        id: req.params.id
      }
    });
  });

  billsRouter.put('/:id', function(req, res) {
    res.send({
      'bills': {
        id: req.params.id
      }
    });
  });

  billsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/bills', require('body-parser'));
  app.use('/api/bills', billsRouter);
};
