import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    powers: DS.hasMany('power',{ async: false,inverse: null }),
    description: DS.attr('string',{ defaultValue: '' }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    searchKeys:Ember.computed("name",function(){
        if(!this.get("id")){
            return [];
        }
        return [this.get("name").toLowerCase()];
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
            else{
                var curId = this.get("id");
                var isRepeated = this.store.peekAll('role').filter(function (role) {
                    return role.get("id") !== curId && role.get("name") === name;
                }).length > 0;
                if(isRepeated){
                    this.get('errors').add('name', '不能重复');
                }
            }
        }
    }),
    descriptionDidChange:Ember.observer('description',function(){
        var description = this.get("description");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            description = description.trim();
            if(!Ember.isEmpty(description) && description.length > 200){
                this.get('errors').add('description', '长度不能超过200字符');
            }
        }
    })
});
