import Ember from 'ember';
import InstanceDetailRestoreCarRouteMixin from '../../../mixins/instance-detail/restore-car-route';
import { module, test } from 'qunit';

module('Unit | Mixin | instance detail/restore car route');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceDetailRestoreCarRouteObject = Ember.Object.extend(InstanceDetailRestoreCarRouteMixin);
  let subject = InstanceDetailRestoreCarRouteObject.create();
  assert.ok(subject);
});
