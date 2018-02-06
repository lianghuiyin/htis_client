import Ember from 'ember';
import StandardListControllerMixin from '../../../mixins/standard-list/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | standard list/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardListControllerObject = Ember.Object.extend(StandardListControllerMixin);
  let subject = StandardListControllerObject.create();
  assert.ok(subject);
});
