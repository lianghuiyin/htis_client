import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    shortcut_hour: DS.attr('number',{ defaultValue: 0 }),
    finish_hour: DS.attr('number',{ defaultValue: 0 }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    finishHourDidChange:Ember.observer('finish_hour', function() {
        let finish_hour = this.get("finish_hour");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(finish_hour)){
                this.get('errors').add('finish_hour', '请输入合法数值');
            }
            else if(finish_hour <= 0){
                this.get('errors').add('finish_hour', '请输入大于0的数值');
            }
            else if(finish_hour && /^[-]\d+([.]\d{0,})?$/.test(finish_hour)){
                this.get('errors').add('finish_hour', '不允许负数');
            }
            else if(finish_hour && /^\d+[.]\d{0,}$/.test(finish_hour)){
                this.get('errors').add('finish_hour', '输入小数位过多');
            }
        }
    })
});
