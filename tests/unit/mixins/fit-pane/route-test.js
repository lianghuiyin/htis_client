import Ember from 'ember';
import FitPaneRouteMixin from '../../../mixins/fit-pane/route';
import { module, test } from 'qunit';

module('Unit | Mixin | fit pane/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let FitPaneRouteObject = Ember.Object.extend(FitPaneRouteMixin);
  let subject = FitPaneRouteObject.create();
  assert.ok(subject);
});
