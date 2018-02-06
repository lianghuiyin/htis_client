import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('loading');
  this.route('startup');
  this.route('login');
  this.route('account',function(){
      this.route('info',function(){
          this.route('edit',function(){
              
          });
      });
      this.route('pwd');
  });
  this.route('start', function() {
    this.route('bill', { path: '/:id' });
  });
  this.route('scanning', function() {
    this.route('filling');
  });
  this.route('setting', function() {
    this.route('roles', {}, function() {
      this.route('role', { path: '/:id' },function(){
        this.route('edit', {});
      });
      this.route('new');
    });
    this.route('users', {}, function() {
      this.route('user', { path: '/:id' },function() {
        this.route('edit');
        this.route('resetpwd');
      });
      this.route('new');
    });
    this.route('projects', {}, function() {
      this.route('project', { path: '/:id' }, function() {
        this.route('edit');
      });
      this.route('new');
    });
    this.route('departments', {}, function() {
      this.route('department', { path: '/:id' }, function() {
        this.route('edit');
      });
      this.route('new');
    });
    this.route('oils', {}, function() {
      this.route('oil', { path: '/:id' }, function() {
        this.route('edit');
      });
      this.route('new');
    });
    this.route('preference',{}, function() {
      this.route('edit');
    });
  });
  this.route('manage', function() {
    this.route('cars', function() {
      this.route('car',{ path: '/car/:id' }, function() {
        this.route('edit');
      });
      this.route('new');
    });
    this.route('pendings', function() {
      this.route('pending',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('newinstance');
      });
    });
    this.route('releases', function() {
      this.route('release',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('newinstance');
        this.route('archive');
      });
    });
    this.route('disables', function() {
      this.route('disable',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('newinstance');
        this.route('archive');
      });
    });
    this.route('archives', function() {
      this.route('archive',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('restore');
      });
    });
    this.route('unuseds', function() {
      this.route('unused',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('archive');
        this.route('newinstance');
      });
      this.route('new');
    });
    this.route('searchs', function() {
      this.route('search',{ path: '/:id' }, function() {
        this.route('edit');
        this.route('archive');
        this.route('newinstance');
        this.route('restore');
      });
    });
  });
  this.route('history', function() {
    this.route('bills', {}, function() {
      this.route('bill', { path: '/:id' },function(){
        this.route('edit', {});
      });
      this.route('new');
      this.route('filter');
    });
    this.route('reports', function() {
      this.route('filter');
    });
  });
  this.route('controller', function() {});
  this.route('online');
  this.route('shortcut', function() {});
  this.route('valids');
});

export default Router;