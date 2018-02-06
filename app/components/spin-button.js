import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['spin-button'],
    classNameBindings: ['isIcon','isLoading','isDisabled:disabled'],
    isDisabled:false,
    isLoading:false,
    isIcon:false,
    loadingIcon:"glyphicon-transfer",
    loadedIcon:"glyphicon-circle-arrow-right",
    loadingText:"loading",
    tagName:"button",
    attributeBindings:["title"],
    title:"",
    titleIcon:"",
    isAutoLoading:true,
    click:function(){
        if(this.get("isAutoLoading")){
            this.sendAction('action',{isFromSpinButton:true});
        }
        else{
            if(!this.get('isLoading')){
                this.set('isLoading', true);
                this.sendAction('action',{isFromSpinButton:true});
            }
        }
    }
});
