import Ember from 'ember';
import ManageCarsControllerMixin from '../../../mixins/manage-cars/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | manage cars/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let ManageCarsControllerObject = Ember.Object.extend(ManageCarsControllerMixin);
  let subject = ManageCarsControllerObject.create();
  assert.ok(subject);
});
