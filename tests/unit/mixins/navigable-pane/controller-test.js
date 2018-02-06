import Ember from 'ember';
import NavigablePaneControllerMixin from '../../../mixins/navigable-pane/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | navigable pane/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let NavigablePaneControllerObject = Ember.Object.extend(NavigablePaneControllerMixin);
  let subject = NavigablePaneControllerObject.create();
  assert.ok(subject);
});
