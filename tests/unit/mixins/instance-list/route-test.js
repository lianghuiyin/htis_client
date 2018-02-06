import Ember from 'ember';
import InstanceListRouteMixin from '../../../mixins/instance-list/route';
import { module, test } from 'qunit';

module('Unit | Mixin | instance list/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceListRouteObject = Ember.Object.extend(InstanceListRouteMixin);
  let subject = InstanceListRouteObject.create();
  assert.ok(subject);
});
