import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["pick-up"],
	isPicking:false,
	value:"",
    click:function(){
    	this.toggleProperty("isPicking");
    }
});
