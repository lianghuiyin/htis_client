import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string',{ defaultValue: '' }),
    phone: DS.attr('string',{ defaultValue: '' }),
    email: DS.attr('string',{ defaultValue: '' }),
    role: DS.belongsTo('role',{ async: false,inverse: null }),
    signature: DS.attr('string',{ defaultValue: '' }),
    is_sign_needed: DS.attr('boolean',{ defaultValue: true }),
    is_enable: DS.attr('boolean',{ defaultValue: true }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    isBillScannerPowered:Ember.computed("role","role.powers",function(){
        let powers = this.get("role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("4");
    }),
    searchKeys:Ember.computed("name","phone","email","role.name",function(){
        return [this.get("name").toLowerCase(),
            this.get("phone").toLowerCase(),
            this.get("email").toLowerCase(),
            this.get("role.name").toLowerCase()];
    }),
    nameDidChange:Ember.observer('name', function() {
        let name = this.get("name");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            name = name.trim();
            if(Ember.isEmpty(name)){ 
                this.get('errors').add('name', '不能为空');
            }
            else if(name.length > 20){
                this.get('errors').add('name', '长度不能超过20字符');
            }
            //名称允许重复
            // else{
            //     var curId = this.get("id");
            //     var isRepeated = this.store.peekAll('user').filter(function (user) {
            //         return user.get("id") !== curId && user.get("name") === name;
            //     }).length > 0;
            //     if(isRepeated){
            //         this.get('errors').add('name', '不能重复');
            //     }
            // }
        }
    }),
    phoneDidChange:Ember.observer('phone',function(){
        var phone = this.get("phone"),
            email = this.get("email");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            phone = phone.trim();
            email = email.trim();
            if(Ember.isEmpty(phone) && Ember.isEmpty(email)){
                this.get('errors').add('phone', '手机号及邮箱至少有一个不能为空');
            }
            else{
                this.get('errors').remove('phone');
                if(this.get('errors').get("email")){
                    this.notifyPropertyChange("email");
                }
            }
            if(!Ember.isEmpty(phone) && phone.length > 20){
                this.get('errors').add('phone', '长度不能超过20字符');
            }
            else{
                var curId = this.get("id");
                var isRepeatedForPhone = this.store.peekAll('user').filter(function (user) {
                    return !Ember.isEmpty(phone) && user.get("id") !== curId && user.get("phone") === phone;
                }).length > 0;
                if(isRepeatedForPhone){
                    this.get('errors').add('phone', '不能重复');
                }
            }
        }
    }),
    emailDidChange:Ember.observer('email',function(){
        var phone = this.get("phone"),
            email = this.get("email");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            phone = phone.trim();
            email = email.trim();
            if(Ember.isEmpty(phone) && Ember.isEmpty(email)){
                this.get('errors').add('email', '手机号及邮箱至少有一个不能为空');
            }
            else{
                this.get('errors').remove('email');
                if(this.get('errors').get("phone")){
                    this.notifyPropertyChange("phone");
                }
            }
            if(!Ember.isEmpty(email) && !window.HOJS.lib.valiEmailValue(email)){
                this.get('errors').add('email', '格式不正确');
            }
            else if(!Ember.isEmpty(email) && email.length > 100){
                this.get('errors').add('email', '长度不能超过100字符');
            }
            else{
                var curId = this.get("id");
                var isRepeatedForEmail = this.store.peekAll('user').filter(function (user) {
                    return !Ember.isEmpty(email) && user.get("id") !== curId && user.get("email") === email;
                }).length > 0;
                if(isRepeatedForEmail){
                    this.get('errors').add('email', '不能重复');
                }
            }
        }
    }),
    signatureDidChange:Ember.observer('signature',function(){
        var signature = this.get("signature");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            signature = signature.trim();
            if(!Ember.isEmpty(signature) && signature.length > 200){
                this.get('errors').add('signature', '长度不能超过200字符');
            }
        }
    }),
    roleDidChange:Ember.observer('role',function(){
        var role = this.get("role");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(role)){
                this.get('errors').add('role', '不能为空');
            }
            else{
                this.get('errors').remove('role');
            }
        }
    })
});
