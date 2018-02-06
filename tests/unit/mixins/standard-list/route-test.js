import Ember from 'ember';
import StandardListRouteMixin from '../../../mixins/standard-list/route';
import { module, test } from 'qunit';

module('Unit | Mixin | standard list/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardListRouteObject = Ember.Object.extend(StandardListRouteMixin);
  let subject = StandardListRouteObject.create();
  assert.ok(subject);
});
