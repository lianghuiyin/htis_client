import Ember from 'ember';
import StandardDetailNewRouteMixin from '../../../mixins/standard-detail/new-route';
import { module, test } from 'qunit';

module('Unit | Mixin | standard detail/new route');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardDetailNewRouteObject = Ember.Object.extend(StandardDetailNewRouteMixin);
  let subject = StandardDetailNewRouteObject.create();
  assert.ok(subject);
});
