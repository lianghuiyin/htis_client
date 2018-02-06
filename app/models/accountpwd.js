import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    user: DS.belongsTo('user'),
    old_password: DS.attr('string'),
    new_password: DS.attr('string'),
    confirm_password: DS.attr('string'),
	oldPasswordDidChange: Ember.observer('old_password', function() {
        let old_password = this.get("old_password");
        if(this.get("hasDirtyAttributes")){
            if(Ember.isEmpty(old_password)){
                this.get('errors').add('old_password', '不能为空');
            }
        }
	}),
    newPasswordDidChange:Ember.observer('new_password',function(){
        let new_password = this.get("new_password");
        if(this.get("hasDirtyAttributes")){
            if(Ember.isEmpty(new_password)){
                this.get('errors').add('new_password', '不能为空');
            }
            // else if(!window.HOJS.lib.valiPasswordValue(new_password)){
            //     this.get('errors').add('new_password', '以字母开头，长度在6~16之间，只能包含字符、数字和下划线');
            // }
        }
    }),
    confirmPasswordDidChange:Ember.observer('confirm_password',function(){
        let confirm_password = this.get("confirm_password"),
            new_password = this.get("new_password");
        if(this.get("hasDirtyAttributes")){
            if(Ember.isEmpty(confirm_password)){
                this.get('errors').add('confirm_password', '不能为空');
            }
            else if(new_password !== confirm_password){
                this.get('errors').add('confirm_password', '两次输入的密码必须相同');
            }
        }
    })
});
