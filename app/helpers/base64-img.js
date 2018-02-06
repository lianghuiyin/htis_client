import Ember from 'ember';

export function base64Img([base64]) {
	return Ember.String.htmlSafe(`<img class = 'base64-img' src = "data:image/png;base64,${base64}"/>`);
}

export default Ember.Helper.helper(base64Img);
