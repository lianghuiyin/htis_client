import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    user: DS.attr('string'),
    userObject: Ember.computed("user",function(){
        let userId = this.get("user");
        return this.store.peekRecord("user",userId);
    }),
    // user: DS.belongsTo('user', { async: false,inverse: null }),
    new_password: DS.attr('string', {defaultValue: "hhhhhh"}),
    newPasswordDidChange:Ember.observer("new_password",function(){
        let new_password = this.get("new_password");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            new_password = new_password.trim();
            if(Ember.isEmpty(new_password)){ 
                this.get('errors').add('new_password', '不能为空');
            }
            // else if(!window.HOJS.lib.valiPasswordValue(new_password)){
            //     this.get('errors').add('new_password', '以字母开头，长度在6~16之间，只能包含字符、数字和下划线');
            // }
        }
    })
});
