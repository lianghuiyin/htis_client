import Ember from 'ember';
import FitPaneControllerMixin from '../../../mixins/fit-pane/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | fit pane/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let FitPaneControllerObject = Ember.Object.extend(FitPaneControllerMixin);
  let subject = FitPaneControllerObject.create();
  assert.ok(subject);
});
