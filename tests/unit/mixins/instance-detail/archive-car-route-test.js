import Ember from 'ember';
import InstanceDetailArchiveCarRouteMixin from '../../../mixins/instance-detail/archive-car-route';
import { module, test } from 'qunit';

module('Unit | Mixin | instance detail/archive car route');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceDetailArchiveCarRouteObject = Ember.Object.extend(InstanceDetailArchiveCarRouteMixin);
  let subject = InstanceDetailArchiveCarRouteObject.create();
  assert.ok(subject);
});
