import Ember from 'ember';
var alreadyRun = false;
export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');

  	if (alreadyRun) {
		return;
	} else {
		alreadyRun = true;
	}
	Ember.Component.reopen({
	  init() {
	    this._super();
	    var self = this;
	    // bind attributes beginning with 'data-'
	    Object.keys(this).forEach(function(key) {
	      if (key.substr(0, 5) === 'data-') {
	        self.get('attributeBindings').pushObject(key);
	      }
	    });
	  }
	});
	Ember.TextSupport.reopen({
	    placeHolderFunction:Ember.on("didInsertElement",function(){
	        if(!window.$.fn.placeholder.support){
	        	this.$().placeholder();
		    }
	    }),
	    placeholderDidChange:Ember.observer("placeholder",function(){
	        //如果浏览器不支持placeholder功能，则重新绑定一次placeholder插件
	        if(!window.$.fn.placeholder.support){
	            Ember.run.next(this,function(){
	                if(!this.get("value")){
	                    this.set("value","");
	                    this.$().val(this.get("placeholder"));
	                }
	                this.$().placeholder();
	            });
	        }
	    })
	});
}

export default {
  name: 'reopen-components',
  initialize: initialize
};
