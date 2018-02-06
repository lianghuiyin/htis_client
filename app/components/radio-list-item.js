import Ember from 'ember';

export default Ember.Component.extend({
	content:null,
	compareto:[],
	tagName:"label",
    //disabled属于对部分标签有bug，所以不能用，比如label标签，但实际上浏览器对disabled属性的效果只是样式而并没有行为上的意义，所以完全可以用class中的disabled样式代替
    // attributeBindings:["disabled"],
    classNames: ['radio-list-item','btn','btn-default'],
    classNameBindings: ['isChecked:active','isSmall:btn-sm'],
    isSmall:true,
    contentValueKey:null,
    isChecked:Ember.computed("content","compareto",function(){
        let compareto = this.get("compareto");
        if(compareto === undefined){
            return false;
        }
        let contentValueKey = this.get("contentValueKey");
        if(contentValueKey){
	    	return compareto === this.get("content")[contentValueKey];
        }
        else{
	    	return compareto === this.get("content");
        }
    }),
    click:function(){
    	let params;
        let contentValueKey = this.get("contentValueKey");
    	if(contentValueKey){
    		params = this.get("content")[contentValueKey];
    	}
        else{
            params = this.get("content");
        }
        this.sendAction('action',params);
    }
});
