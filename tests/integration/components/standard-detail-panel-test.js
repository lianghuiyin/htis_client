import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('standard-detail-panel', 'Integration | Component | standard detail panel', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{standard-detail-panel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#standard-detail-panel}}
      template block text
    {{/standard-detail-panel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
