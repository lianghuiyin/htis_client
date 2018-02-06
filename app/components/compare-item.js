import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
	content:null,
	compareto:null,
    classNames: ['compare-item'],
    isChangeTagable:false,
    changeTag:"",
    changeTags:[],
    // classNameBindings: ['isEqual:active'],
    isEqual:Ember.computed("content","content.[]","compareto",function(){
        let compareto = this.get("compareto");
        let content = this.get("content");
        let isChangeTagable = this.get("isChangeTagable");
        let changeTag = this.get("changeTag");
        let changeTags = this.get("changeTags");
        let isEqual = false; 
        if(content instanceof DS.ManyArray && compareto instanceof DS.ManyArray){
        	isEqual = compareto.mapBy("id").sort().join(",") === content.mapBy("id").sort().join(",");
        }
        else if(Ember.isArray(content) && Ember.isArray(compareto)){
	    	isEqual = compareto.sort().join(",") === content.sort().join(",");
        }
        else if(content instanceof Date && compareto instanceof Date){
            isEqual = compareto.getTime() === content.getTime();
        }
        else{
	    	isEqual = compareto === content;
        }
        if(isChangeTagable){
            if(isEqual){
                changeTags.removeObject(changeTag);
            }
            else{
                changeTags.addObject(changeTag);
            }
        }
        return isEqual;
    })
});
