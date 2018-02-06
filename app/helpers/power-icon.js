import Ember from 'ember';

export function powerIcon([power,role]) {
  	let isPowerAllowed = role.get("powers").mapBy("id").contains(power.get("id"));
  	let icon = isPowerAllowed ? "glyphicon-eye-open text-success" : "glyphicon-eye-close text-danger";
	return Ember.String.htmlSafe(`<span class = 'glyphicon ${icon}'></span>`);
}

export default Ember.Helper.helper(powerIcon);
