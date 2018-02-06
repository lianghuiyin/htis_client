import Ember from 'ember';
import StandardDetailControllerMixin from '../../../mixins/standard-detail/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | standard detail/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let StandardDetailControllerObject = Ember.Object.extend(StandardDetailControllerMixin);
  let subject = StandardDetailControllerObject.create();
  assert.ok(subject);
});
