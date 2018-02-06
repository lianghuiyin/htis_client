import Ember from 'ember';
import InstanceDetailControllerMixin from '../../../mixins/instance-detail/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | instance detail/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceDetailControllerObject = Ember.Object.extend(InstanceDetailControllerMixin);
  let subject = InstanceDetailControllerObject.create();
  assert.ok(subject);
});
