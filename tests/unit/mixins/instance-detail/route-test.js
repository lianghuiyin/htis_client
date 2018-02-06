import Ember from 'ember';
import InstanceDetailRouteMixin from '../../../mixins/instance-detail/route';
import { module, test } from 'qunit';

module('Unit | Mixin | instance detail/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceDetailRouteObject = Ember.Object.extend(InstanceDetailRouteMixin);
  let subject = InstanceDetailRouteObject.create();
  assert.ok(subject);
});
