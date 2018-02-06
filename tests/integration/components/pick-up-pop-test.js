import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pick-up-pop', 'Integration | Component | pick up pop', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{pick-up-pop}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#pick-up-pop}}
      template block text
    {{/pick-up-pop}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
