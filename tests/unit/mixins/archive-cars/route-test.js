import Ember from 'ember';
import ArchiveCarsRouteMixin from '../../../mixins/archive-cars/route';
import { module, test } from 'qunit';

module('Unit | Mixin | archive cars/route');

// Replace this with your real tests.
test('it works', function(assert) {
  let ArchiveCarsRouteObject = Ember.Object.extend(ArchiveCarsRouteMixin);
  let subject = ArchiveCarsRouteObject.create();
  assert.ok(subject);
});
