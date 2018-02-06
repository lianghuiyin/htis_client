import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('checkbox-list-value', 'Integration | Component | checkbox list value', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{checkbox-list-value}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#checkbox-list-value}}
      template block text
    {{/checkbox-list-value}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
