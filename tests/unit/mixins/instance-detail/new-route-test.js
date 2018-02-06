import Ember from 'ember';
import InstanceDetailNewRouteMixin from '../../../mixins/instance-detail/new-route';
import { module, test } from 'qunit';

module('Unit | Mixin | instance detail/new route');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceDetailNewRouteObject = Ember.Object.extend(InstanceDetailNewRouteMixin);
  let subject = InstanceDetailNewRouteObject.create();
  assert.ok(subject);
});
