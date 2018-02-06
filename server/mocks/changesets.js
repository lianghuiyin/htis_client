module.exports = function(app) {
  var express = require('express');
  var changesetsRouter = express.Router();

  changesetsRouter.get('/', function(req, res) {
    res.send({
      'changesets': []
    });
  });

  changesetsRouter.post('/', function(req, res) {
    var changeset = {};
    changeset["Users"] = app.users;
    changeset["Roles"] = app.roles;
    // changeset["Powers"] = app.powers;
    changeset["Projects"] = app.projects;
    changeset["Departments"] = app.departments;
    changeset["Oils"] = app.oils;
    // changeset["Cars"] = app.cars;
    // changeset["Instances"] = app.instances;
    // changeset["Traces"] = app.traces;
    changeset["Bills"] = app.bills;
    changeset["Messages"] = app.messages;
    changeset["Signatures"] = app.signatures;
    changeset["Deleteds"] = app.deleteds;
    changeset["SyncToken"] = new Date();
    res.status(201).send({ 'Changeset': changeset });
  });

  changesetsRouter.get('/:id', function(req, res) {
    res.send({
      'changesets': {
        id: req.params.id
      }
    });
  });

  changesetsRouter.put('/:id', function(req, res) {
    res.send({
      'changesets': {
        id: req.params.id
      }
    });
  });

  changesetsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/changesets', changesetsRouter);
};
