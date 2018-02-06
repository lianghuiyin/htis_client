import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
	content:null,
	compareto:null,
	tagName:"a",
    isNeedToCheckNew:true,
    classNames: ['list-group-item'],
    classNameBindings: ['isChecked:active'],
    isChecked:Ember.computed("content","compareto","content.isNew",function(){
        let compareto = this.get("compareto");
        let content = this.get("content");
        let isNeedToCheckNew = this.get("isNeedToCheckNew");
        if(isNeedToCheckNew && content instanceof DS.Model && content.get("isNew")){
            //新建记录默认选中
            return true;
        }
        if(!compareto){
            return false;
        }
    	return compareto === content;
    }),
    click:function(){
        if(!this.get("isChecked")){
            this.sendAction('action',this.get("content"));
        }
    }
});
