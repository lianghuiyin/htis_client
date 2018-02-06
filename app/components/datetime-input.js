import Ember from 'ember';

export default Ember.TextField.extend({
	classNames:["datetime-input"],
	format:"yyyy-MM-ddThh:mm",
	target:null,
	// value:null,
    attributeBindings: ['placeholder'],
    placeholder:"",
    type:Ember.computed(function(){
        // window.navigator.userAgent.toLowerCase().indexOf("safari") > 0 ? "number"
        // return this.container.lookup("service:equipment").get("isXs") ? "number" : "text";
        var platform = window.navigator.platform.toLowerCase();
        if(platform.indexOf("mac") > -1 || platform.indexOf("win") > -1){
            //PC上上text
            return "text";
        }
        else{
            //手机及pad上用数值
            return "datetime-local";
        }
    }),
    value:Ember.computed("target",function(){
        if(this.get("type") === "text"){
            return this.get("target").format(this.get("format").replace("T"," "));
        }
        else{
            return this.get("target").format(this.get("format"));
        }
    }),
    valueDidChange:Ember.observer("value",function(){
    	let value = this.get("value");
    	let targetValue = window.HOJS.lib.parseDate((value).replace("T"," "));
    	this.set("target",targetValue);
    })
});
