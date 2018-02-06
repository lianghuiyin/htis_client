import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    tagForInstances:1,
    isOwnNotifyTag:false,
    number: DS.attr('string'),
    vin: DS.attr('string'),
    model: DS.attr('string',{ defaultValue: '' }),
    is_archived:DS.attr('boolean', { defaultValue: false }),
    instance_count: DS.attr('number', { defaultValue: 0 }),
    bill_count: DS.attr('number', { defaultValue: 0 }),
    previous_oil: DS.belongsTo('oil',{ async: false }),
    last_oil: DS.belongsTo('oil',{ async: false }),
    last_volume: DS.attr('number', { defaultValue: 0 }),
    last_mileage: DS.attr('number', { defaultValue: 0 }),
    last_rate: DS.attr('number',{ defaultValue: 0 }),
    description: DS.attr('string',{ defaultValue: '' }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    searchKeys:Ember.computed("name",function(){
        if(!this.get("id")){
            return [];
        }
        return [this.get("number").toLowerCase(),this.get("vin").toLowerCase(),this.get("model").toLowerCase()];
    }),
    numberDidChange:Ember.observer('number', function() {
        let number = this.get("number");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            number = number.trim();
            if(Ember.isEmpty(number)){
                this.get('errors').add('number', '不能为空');
            }
            else if(number.length > 20){
                this.get('errors').add('number', '长度不能超过20字符');
            }
            else{
                let curId = this.get("id");
                let isRepeated = this.store.peekAll('car').filter(function (car) {
                    return car.get("id") !== curId && car.get("number") === number;
                }).length > 0;
                if(isRepeated){
                    this.get('errors').add('number', '不能重复');
                }
            }
        }
    }),
    vinDidChange:Ember.observer('vin',function(){
        let vin = this.get("vin");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            // vin = vin.trim();
            if(/\s/g.test(vin)){
                this.get('errors').add('vin', '不能包含空格符');
            }
            else if(Ember.isEmpty(vin)){
                this.get('errors').add('vin', '不能为空');
            }
            else if(vin.length > 100){
                this.get('errors').add('vin', '长度不能超过100字符');
            }
            else{
                let curId = this.get("id");
                let isRepeated = this.store.peekAll('car').filter(function (car) {
                    return car.get("id") !== curId && car.get("vin") === vin;
                }).length > 0;
                if(isRepeated){
                    this.get('errors').add('vin', '不能重复');
                }
            }
        }
    }),
    modelDidChange:Ember.observer('model',function(){
        let model = this.get("model");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            model = model.trim();
            if(!Ember.isEmpty(model) && model.length > 20){
                this.get('errors').add('model', '长度不能超过20字符');
            }
        }
    }),
    descriptionDidChange:Ember.observer('description',function(){
        let description = this.get("description");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            description = description.trim();
            if(!Ember.isEmpty(description) && description.length > 200){
                this.get('errors').add('description', '长度不能超过200字符');
            }
        }
    }),
    // instances: DS.hasMany('instance',{ async: false }),
    instances:Ember.computed("modified_date","tagForInstances",function(){
        Ember.debug("instances--------" + this.get("number"));
        let curId = this.get("id");
        return this.store.peekAll("instance").filter((item)=>{
            return item.get("car.id") === curId && !item.get("isDeleted");
        });
    }),
    isUnused:Ember.computed("instances","is_archived",function(){
        Ember.debug("isUnused--------" + this.get("number"));
        if(this.get("is_archived")){
            return false;
        }
        else{
            let instances = this.get("instances").filterBy("is_archived",false);
            //没有发布或者没有启用的都是闲置状态
            if(instances.get("length") === 0){
                return true;
            }
            else{
                return instances.any((item)=>{
                    return !item.get("is_released") || !item.get("is_enable") || item.get("isFinished");
                });
            }
        }
    }),
    isPending:Ember.computed("instances","is_archived",function(){
        if(this.get("is_archived")){
            return false;
        }
        else{
            let instances = this.get("instances");//.filterBy("is_archived",false);
            return instances.isAny("is_pending",true);
        }
    }),
    isReleased:Ember.computed("instances","is_archived",function(){
        if(this.get("is_archived")){
            return false;
        }
        else{
            //可加油且已启用才算是可加油状态
            let instances = this.get("instances");//.filterBy("is_archived",false);
            return instances.any((item)=>{
                return item.get("is_released") && item.get("is_enable") && !item.get("isFinished") && !item.get("is_archived");
            });
        }
    }),
    isDisable:Ember.computed("instances","is_archived",function(){
        if(this.get("is_archived")){
            return false;
        }
        else{
            let instances = this.get("instances").filterBy("is_archived",false);
            return instances.isAny("is_enable",false);
        }
    }),
    isArchivable:Ember.computed("instances","isNew","is_archived",function(){
        if(this.get("is_archived") || this.get("isNew")){
            return false;
        }
        else{
            //有任何一个申请单没有归档，则该车辆不可以归档。
            //申请单个数为0的车辆可以归档
            let instances = this.get("instances");
            return !instances.isAny("is_archived",false);
        }
    }),
    isFinished:Ember.computed("instances.@each.isFinished","is_archived",function(){
        if(this.get("is_archived")){
            return false;
        }
        //有任何申请单过期，则显示车辆有过期申请单
        let instances = this.get("instances");
        return instances.isAny("isFinished",true);
    }),
    isFinishing:Ember.computed("instances.@each.isFinishing","is_archived",function(){
        if(this.get("is_archived")){
            return false;
        }
        //有任何申请单过期，则显示车辆有过期申请单
        if(this.get("isFinished")){
            return true;
        }
        else{
            let instances = this.get("instances");
            return instances.isAny("isFinishing",true);
        }
    }),
    rateColor:Ember.computed("last_rate","previous_oil.yellow_rate","previous_oil.red_rate",function(){
        let last_rate = this.get("last_rate");
        let yellow_rate = this.get("previous_oil.yellow_rate");
        let red_rate = this.get("previous_oil.red_rate");
        if(last_rate && yellow_rate && red_rate){
            if(last_rate > red_rate){
                return "danger";
            }
            else if(last_rate > yellow_rate){
                return "warning";
            }
            else{
                return "success";
            }
        }
        else{
            return "muted";
        }
    }),
    isOwn:Ember.computed("instances","creater.id","modifier.id","isOwnNotifyTag",function(){
        Ember.debug("isOwn-car--------------------");
        //是否是当前用户关联车辆
        let userId = this.container.lookup('controller:session').get("userId").toString();
        let isOwn = this.get("creater.id") === userId || this.get("modifier.id") === userId;
        if(isOwn){
            return true;
        }
        else{
            let instances = this.get("instances");
            return instances.isAny("isOwn",true);
        }
    }),
    // isArchivedDidChange:Ember.observer("is_archived",function(){
    //     //不需要了，让它留着，因为每天归档的数据不多
    //     //归档状态变化时触发，如果变成归档状态，则从store中移除记录
    //     if(this.get("is_archived")){
    //         Ember.run.next(()=>{
    //             this.store.unloadRecord(this);
    //         });
    //     }
    // }),
    instanceCountDidChange:Ember.observer("instance_count",function(){
        Ember.run.next(()=>{
            this.get("instances").filterBy("is_archived",false).forEach((instance)=>{
                instance.notifyPropertyChange("messageNotifyTag");
            });
        });
    })
});
