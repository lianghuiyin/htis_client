import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["container-wrap","trans-all-05","opacity09"],
	classNameBindings:['isMulti:is-multi','isFolded:is-folded','isFull:container-full','isLeft:container-left','isCenter:container-center','isRight:container-right'],
	isFolded:false,
	isFull:false,
	isLeft:false,
	isCenter:false,
	isRight:false,
	isMulti:false,
	isBoxShadow:false
});
