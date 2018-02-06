module.exports = function(app) {
  var express = require('express');
  var startupsRouter = express.Router();

  app.users = [
    {
      Id: 1,
      Name: '初始账户',
      Password: 'hhhhhh',
      Role: 1,
      Phone:'11111111111',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'111',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },
    {
      Id: 2,
      Name: '车大平',
      Password: 'hhhhhh',
      Role: 2,
      Phone:'22222222222',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'111',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },
    {
      Id: 3,
      Name: '仇工',
      Password: 'hhhhhh',
      Role: 3,
      Phone:'33333333333',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'111',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },
    {
      Id: 4,
      Name: '张家由',
      Password: 'hhhhhh',
      Role: 4,
      Phone:'44444444444',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'111',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },
    {
      Id: 5,
      Name: '补录员',
      Password: 'hhhhhh',
      Role: 5,
      Phone:'55555555555',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'111',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 6,
      Name: 'guest',
      Password: 'hhhhhh',
      Role: 6,
      Phone:'66666666666',
      Email:'',
      IsSignNeeded:true,
      IsEnable:true,
      Signature:'222',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.powers = [
    {
      Id: 1,
      Name: '系统设置',
      Description: '设置系统基础资料'
    },{
      Id: 2,
      Name: '车辆管理',
      Description: '维护车辆及提交加油申请单',
    },{
      Id: 3,
      Name: '加油审核',
      Description: '审核加油申请单'
    },{
      Id: 4,
      Name: '扫码加油',
      Description: '扫码录入加油单'
    },{
      Id: 5,
      Name: '加油单补录',
      Description: '补录及修改加油单'
    }
  ];

  app.roles = [
    {
      Id: 1,
      Name: '系统管理员',
      Powers: [1,3,5],
      Description: '系统管理员作为系统中最高级别角色，有最高级别功能权限。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 2,
      Name: '车辆管理员',
      Powers: [2],
      Description: '车辆管理员作为系统中车辆管理人员，主要负责提交加油申请单。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 3,
      Name: '加油审核员',
      Powers: [3],
      Description: '加油审核员作为系统中审核加油权限人员，主要负责审核加油申请单。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 4,
      Name: '加油工',
      Powers: [4],
      Description: '加油工作为系统中加油操作人员，只有扫码加油权限。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 5,
      Name: '加油补录员',
      Powers: [4,5],
      Description: '除了可以扫码加油外，还可以修改加油单，且其创建或修改的加油单单号会被标记为红色。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 6,
      Name: '游客',
      Powers: [],
      Description: '游客（或领导）作为系统中巡视或体验用户，没有任何管理权限。',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.projects = [
    {
      Id: 1,
      Name: '项目1',
      IsEnable: true,
      Description: '项目1描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 2,
      Name: '项目2',
      IsEnable: true,
      Description: '项目2描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 3,
      Name: '项目3',
      IsEnable: true,
      Description: '项目3描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 4,
      Name: '项目4',
      IsEnable: true,
      Description: '项目4描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 5,
      Name: '项目5',
      IsEnable: false,
      Description: '项目5描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.departments = [
    {
      Id: 1,
      Name: '部门1',
      Description: '部门1描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 2,
      Name: '部门2',
      Description: '部门2描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 3,
      Name: '部门3',
      Description: '部门3描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 4,
      Name: '部门4',
      Description: '部门4描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 5,
      Name: '部门5',
      Description: '部门5描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.oils = [
    {
      Id: 1,
      Name: '油品1',
      YellowRate: 8,
      RedRate: 10,
      Description: '油品1描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 2,
      Name: '油品2',
      YellowRate: 10,
      RedRate: 12,
      Description: '油品2描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 3,
      Name: '油品3',
      YellowRate: 12,
      RedRate: 14,
      Description: '油品3描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 4,
      Name: '油品4',
      YellowRate: 14,
      RedRate: 16,
      Description: '油品4描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.preferences = [
    {
      Id: 1,
      ShortcutHour: 5,
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.cars = [
    {
      Id: 1,
      Number: '车辆1',
      Vin: '123456',
      Model: '模型1',
      IsArchived: false,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆1描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 2,
      Number: '车辆2',
      Vin: '6921505026477',
      Model: '模型2',
      IsArchived: false,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆2描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 3,
      Number: '车辆3',
      Vin: '345678',
      Model: '模型3',
      IsArchived: false,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆3描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 4,
      Number: '车辆4',
      Vin: '456789',
      Model: '模型4',
      IsArchived: false,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆4描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 5,
      Number: '车辆5',
      Vin: '567890',
      Model: '模型5',
      IsArchived: false,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆5描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    },{
      Id: 6,
      Number: '车辆6',
      Vin: '667890',
      Model: '模型6',
      IsArchived: true,
      InstanceCount:0,
      BillCount:0,
      LastOil:null,
      LastVolume:0,
      LastMileage:0,
      Description: '车辆6描述',
      Creater: 1,
      CreatedDate: new Date(),
      Modifier: 1,
      ModifiedDate: new Date()
    }
  ];

  app.signatures = [];

  app.instances = [];
  app.traces = [];
  app.bills = [];
  app.messages = [];
  app.deleteds = [];

  startupsRouter.get('/', function(req, res) {
    res.send({
      'startups': []
    });
  });

  startupsRouter.post('/', function(req, res) {
    // res.status(201).end();

        // var errors = {
        //   ServerSideError:'名称重复'
        // };
        // res.status(422).send({ 'errors': errors});

    var startup = {};
    startup["Users"] = app.users;
    startup["Roles"] = app.roles;
    startup["Powers"] = app.powers;
    startup["Projects"] = app.projects;
    startup["Departments"] = app.departments;
    startup["Oils"] = app.oils;
    startup["Preferences"] = app.preferences;
    startup["Cars"] = app.cars;
    startup["Instances"] = app.instances;
    startup["Traces"] = app.traces;
    startup["Bills"] = app.bills;
    startup["Messages"] = app.messages;
    startup["Signatures"] = app.signatures;
    startup["SyncToken"] = new Date();
    res.status(201).send({ 'Startup': startup });
    
  });

  startupsRouter.get('/:id', function(req, res) {
    var startup = {};
    startup["Id"] = 1;
    startup["Users"] = app.users;
    startup["Roles"] = app.roles;
    startup["Powers"] = app.powers;
    startup["Projects"] = app.projects;
    startup["Departments"] = app.departments;
    startup["Oils"] = app.oils;
    startup["Preferences"] = app.preferences;
    // startup["Cars"] = app.cars;
    // startup["Instances"] = app.instances;
    // startup["Traces"] = app.traces;
    startup["Bills"] = app.bills;
    startup["Messages"] = app.messages;
    startup["Signatures"] = app.signatures;
    startup["SyncToken"] = new Date();
    res.send({
      'Startup': startup
    });
  });

  startupsRouter.put('/:id', function(req, res) {
    res.send({
      'startups': {
        id: req.params.id
      }
    });
  });

  startupsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/startups', startupsRouter);
};
