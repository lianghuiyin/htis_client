import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    yellow_rate: DS.attr('number',{ defaultValue: 0 }),
    red_rate: DS.attr('number',{ defaultValue: 0 }),
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
                var isRepeated = this.store.peekAll('oil').filter(function (oil) {
                    return oil.get("id") !== curId && oil.get("name") === name;
                }).length > 0;
                if(isRepeated){
                    this.get('errors').add('name', '不能重复');
                }
            }
        }
    }),
    yellowRateDidChange:Ember.observer('yellow_rate', function() {
        let yellow_rate = this.get("yellow_rate");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(yellow_rate)){
                this.get('errors').add('yellow_rate', '请输入合法数值');
            }
            else if(yellow_rate && /^[-]\d+([.]\d{0,})?$/.test(yellow_rate)){
                this.get('errors').add('yellow_rate', '不允许负数');
            }
            else if(yellow_rate && /^\d+[.]\d{3,}$/.test(yellow_rate)){
                this.get('errors').add('yellow_rate', '输入小数位过多');
            }
        }
    }),
    redRateDidChange:Ember.observer('red_rate', function() {
        let red_rate = this.get("red_rate");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(red_rate)){
                this.get('errors').add('red_rate', '请输入合法数值');
            }
            else if(red_rate && /^[-]\d+([.]\d{0,})?$/.test(red_rate)){
                this.get('errors').add('red_rate', '不允许负数');
            }
            else if(red_rate && /^\d+[.]\d{3,}$/.test(red_rate)){
                this.get('errors').add('red_rate', '输入小数位过多');
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
