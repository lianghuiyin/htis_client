import Ember from 'ember';
import StandardDetailRouteMixin from '../../../mixins/standard-detail/route';
import { module, test } from 'qunit';

module('Unit | Mixin | standard detail/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardDetailRouteObject = Ember.Object.extend(StandardDetailRouteMixin);
  let subject = StandardDetailRouteObject.create();
  assert.ok(subject);
});
