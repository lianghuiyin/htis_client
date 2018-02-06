import Ember from 'ember';
import ArchiveCarsControllerMixin from '../../../mixins/archive-cars/controller';
import { module, test } from 'qunit';

module('Unit | Mixin | archive cars/controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let ArchiveCarsControllerObject = Ember.Object.extend(ArchiveCarsControllerMixin);
  let subject = ArchiveCarsControllerObject.create();
  assert.ok(subject);
});
