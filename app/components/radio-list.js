import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['radio-list'],
    classNameBindings: ['isWellNeeded:well','isWellNeeded:well-sm'],
    isWellNeeded:Ember.computed('isVertical','isEditing',function(){
    	if(this.get("isEditing")){
    		return this.get("isVertical");
    	}
    	else{
    		return false;
    	}
    }),
	content:[],
	contentValueKey:null,
	isEditing:false,
	isVertical:false,
	value:null,
	checkedContent:Ember.computed('vaue','isEditing',function(){
        let contentValueKey = this.get("contentValueKey");
        let value = this.get("value");
        if(contentValueKey){
	    	return this.get("content").findBy(contentValueKey,value);
        }
        else{
	    	return this.get("content").find((n)=>{
	    		return n === value;
	    	});
        }
	})
});
