import Ember from 'ember';
import NavigablePaneRouteMixin from '../../../mixins/navigable-pane/route';
import { module, test } from 'qunit';

module('Unit | Mixin | navigable pane/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let NavigablePaneRouteObject = Ember.Object.extend(NavigablePaneRouteMixin);
  let subject = NavigablePaneRouteObject.create();
  assert.ok(subject);
});
