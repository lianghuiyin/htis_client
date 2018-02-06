import Ember from 'ember';

export default Ember.Component.extend({
	value:null,
	compareto:[],
	tagName:"label",
	isEditing:false,
	isReadonly:Ember.computed.not('isEditing'),
    //disabled属于对部分标签有bug，所以不能用，比如label标签，但实际上浏览器对disabled属性的效果只是样式而并没有行为上的意义，所以完全可以用class中的disabled样式代替
    // attributeBindings:["disabled"],
    classNames: ['btn','btn-default'],
    classNameBindings: ['isReadonly:disabled','isChecked:active'],
    isChecked:Ember.computed("value","compareto.length",function(){
        let compareto = this.get("compareto");
        if(!compareto){
            return false;
        }
    	return compareto.contains(this.get("value"));
    }),
    click:function(){
        this.sendAction('action',{
        	value:this.get("value"),
        	isChecked:!this.get("isChecked")
        });
    }
});
