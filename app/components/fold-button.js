import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["fold-button"],
	classNameBindings:['isFolded:is-folded'],
	isFolded:false,
    foldedIcon:"glyphicon-triangle-right",
    unfoldedIcon:"glyphicon-triangle-bottom",
	tagName:"a",
    click:function(){
    	this.toggleProperty("isFolded");
    }
});
