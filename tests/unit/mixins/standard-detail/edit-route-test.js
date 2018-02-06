import Ember from 'ember';
import StandardDetailEditRouteMixin from '../../../mixins/standard-detail/edit-route';
import { module, test } from 'qunit';

module('Unit | Mixin | standard detail/edit route');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardDetailEditRouteObject = Ember.Object.extend(StandardDetailEditRouteMixin);
  let subject = StandardDetailEditRouteObject.create();
  assert.ok(subject);
});
