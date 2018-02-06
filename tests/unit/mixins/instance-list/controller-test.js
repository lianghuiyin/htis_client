import Ember from 'ember';
import InstanceListControllerMixin from '../../../mixins/instance-list/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | instance list/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let InstanceListControllerObject = Ember.Object.extend(InstanceListControllerMixin);
  let subject = InstanceListControllerObject.create();
  assert.ok(subject);
});
