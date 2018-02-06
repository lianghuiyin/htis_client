import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    isOwnNotifyTag:false,
    car: DS.belongsTo('car',{ async: false }),
    instance: DS.belongsTo('instance',{ async: false }),
    previous_trace: DS.belongsTo('trace',{ async: false,inverse: null }),
    status: DS.attr('string'),
    is_finished:DS.attr('boolean', { defaultValue: false }),
    is_archived:DS.attr('boolean', { defaultValue: false }),
    project: DS.belongsTo('project',{ async: false }),
    department: DS.belongsTo('department',{ async: false }),
    user_name: DS.attr('string'),
    oils: DS.hasMany('oil',{ async: false,inverse: null }),
    goal: DS.attr('string'),
    start_date: DS.attr('date'),
    end_date: DS.attr('date'),
    start_info: DS.attr('string',{ defaultValue: '' }),
    end_info: DS.attr('string',{ defaultValue: '' }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    isOwn:Ember.computed("modifier.id","isOwnNotifyTag",function(){
        Ember.debug("isOwn-trace--------------------");
        //是否是当前用户关联申请历程
        let userId = this.container.lookup('controller:session').get("userId").toString();
        return this.get("creater.id") === userId || this.get("modifier.id") === userId;
    }),
    // isArchivedDidChange:Ember.observer("is_archived",function(){
    //     //不需要了，让它留着，因为每天归档的数据不多
    //     //归档状态变化时触发，如果变成归档状态，则从store中移除记录
    //     if(this.get("is_archived")){
    //         Ember.run.next(()=>{
    //             this.store.unloadRecord(this);
    //         });
    //     }
    // })
});
