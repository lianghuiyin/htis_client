import Ember from 'ember';

export default Ember.Component.extend({
	model:null,
    classNames:["alert","alert-danger"],
    attributeBindings:["role"],
    role:"alert",
    isCustomized:false,
    actions:{
        ok(){
            this.sendAction('action',this.get("model"));
        }
    }
});
