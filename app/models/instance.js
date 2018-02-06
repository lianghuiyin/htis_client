import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    isOwnNotifyTag:false,
    car: DS.belongsTo('car',{ async: true }),
    project: DS.belongsTo('project',{ async: false }),
    department: DS.belongsTo('department',{ async: false }),
    user_name: DS.attr('string'),
    oils: DS.hasMany('oil',{ async: false,inverse: null }),
    goal: DS.attr('string',{ defaultValue: '' }),
    start_date: DS.attr('date'),
    end_date: DS.attr('date'),
    is_released:DS.attr('boolean', { defaultValue: false }),
    is_pending:DS.attr('boolean', { defaultValue: false }),
    is_archived:DS.attr('boolean', { defaultValue: false }),
    is_enable:DS.attr('boolean', { defaultValue: false }),
    message: DS.belongsTo('message',{ async: false }),
    bill_count: DS.attr('number',{ defaultValue: 0 }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    // traces: DS.hasMany('trace',{ async: false,inverse: null }),
    traces:Ember.computed("modified_date",function(){
        return this.store.peekAll("trace").filterBy("instance.id",this.get("id"));
    }),
    tracesSortingDesc: ['created_date:desc'],
    sortedTracesDesc: Ember.computed.sort('traces', 'tracesSortingDesc'),
    lastTrace:Ember.computed("traces",function(){
        if(this.get("is_pending")){
            return this.get("traces").find(function(trace){
                return !trace.get("is_finished");
            });
        }
        else{
            return this.get("traces.lastObject");
        }
    }),
    isAbortable:Ember.computed("is_released","is_enable",function(){
        //只有可加油并且已启用的申请单才可以中止
        return this.get("is_released") && this.get("is_enable");
    }),
    isForbidable:Ember.computed("is_released","is_enable",function(){
        //只有可加油并且已启用的申请单才可以禁用暂停
        return this.get("is_released") && this.get("is_enable");
    }),
    isFinished:Ember.computed("is_released","is_enable","is_archived","end_date",function(){
        //计算是否过期，用于提醒过期状态，只有可加油的申请单才需要计算
        if(this.get("is_archived")){
            //已结束的就不需要计算了
            return false;
        }
        let isReleased = this.get("is_released") && this.get("is_enable");
        if(isReleased){
            let syncToken = this.container.lookup('controller:application').get("syncToken");
            if(this.get("end_date").getTime() - syncToken.getTime() < 0){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }),
    isFinishing:Ember.computed("is_released","is_enable","is_archived","end_date",function(){
        //计算是否快过期，用于过期前提前提醒用户，只有已发布的申请单才需要计算
        if(this.get("is_archived")){
            //已结束的就不需要计算了
            return false;
        }
        if(this.get("isFinished")){
            return true;
        }
        let isReleased = this.get("is_released");
        if(isReleased){
            let applicationController = this.container.lookup('controller:application');
            let finishHour = applicationController.get("finishHour");
            if(!finishHour){
                finishHour = 48;
            }
            let syncToken = applicationController.get("syncToken");
            if(window.HOJS.lib.dateDiff("H",syncToken,this.get("end_date")) < finishHour){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }),
    isNeedToBellApprove:Ember.computed("is_archived","modified_date",function(){
        //计算是否需要生成核准通知
        //只通知48小时内的核准单子
        if(this.get("is_archived")){
            //已归档申请单不用生成通知
            return false;
        }
        let modifiedDate = this.get("modified_date");
        let syncToken = this.container.lookup('controller:application').get("syncToken");
        if(window.HOJS.lib.dateDiff("H",modifiedDate,syncToken) < 48){
            return true;
        }
        else{
            return false;
        }
    }),
    isOwn:Ember.computed("traces","isOwnNotifyTag",function(){
        Ember.debug("isOwn-instance--------------------");
        //是否是当前用户关联申请单
        let traces = this.get("traces");
        return traces.isAny("isOwn",true);
    }),
    // isArchivedDidChange:Ember.observer("is_archived",function(){
    //     //不需要了，让它留着，因为每天归档的数据不多
    //     //归档状态变化时触发，如果变成归档状态，则从store中移除记录
    //     if(this.get("is_archived")){
    //         Ember.run.next(()=>{
    //             let car = this.get("car");
    //             this.store.unloadRecord(this);
    //             if(car){
    //                 //有可能出现车辆被归档后被从本地移除的情况
    //                 car.notifyPropertyChange("instances");
    //             }
    //         });
    //     }
    // }),
    messageNotifyTag:1,
    lastTraceDidChange:Ember.observer("lastTrace.status","messageNotifyTag",function(){
        //计算当前申请单要生成的通知
        //启用（暂停）、禁用（恢复）及修改申请单没有通知
        Ember.run.next(()=>{
            if(this.get("is_archived")){
                //已归档申请单不用生成通知
                return;
            }
            let isCarManagePowered = this.container.lookup('controller:session').get("isCarManagePowered");
            let isInstanceCheckPowered = this.container.lookup('controller:session').get("isInstanceCheckPowered");
            if(!(isCarManagePowered || isInstanceCheckPowered)){
                //没有权限的没有任何通知需要生成
                return;
            }
            let title = "";
            let icon = "";
            let color = "";
            let text = "";
            let lastTrace = this.get("lastTrace");
            if(!lastTrace){
                Ember.Logger.error(`编号为${this.get("id")}的申请单出现lastTrace为空的情况：
                   可能是申请单没有归档但是其trace被归档了，造成本地没有trace的原因，
                   也可能是出现了申请单的IsPending状态为true，但是其所有trace的is_finished都为true的不正常现象。`);
                return;
            }
            if(isCarManagePowered){
                //车辆管理员收到的通知
                let lastTraceStatus = lastTrace.get("status");
                switch(lastTraceStatus){
                    case "approved":
                        //只通知48小时内的核准单子
                        if(this.get("isNeedToBellApprove")){
                            title = "核准通知";
                            icon = "glyphicon-ok";
                            color = "text-success";
                            text = `审核人[${lastTrace.get("modifier.name")}]核准了车辆[${this.get("car.number")}]的申请单`;
                        }
                        break;
                    case "rejected":
                        title = "驳回通知";
                        icon = "glyphicon-remove";
                        color = "text-danger";
                        text = `审核人[${lastTrace.get("modifier.name")}]驳回了车辆[${this.get("car.number")}]的申请单`;
                        break;
                    case "aborted":
                        title = "中止通知";
                        icon = "glyphicon-stop";
                        color = "text-danger";
                        text = `审核人[${lastTrace.get("modifier.name")}]中止了车辆[${this.get("car.number")}]的申请单`;
                        break;
                }
            }
            else if(isInstanceCheckPowered){
                //车辆审核人收到的通知
                let lastTraceStatus = lastTrace.get("status");
                switch(lastTraceStatus){
                    case "recaptured":
                        title = "取回通知";
                        icon = "glyphicon-adjust";
                        color = "text-info";
                        text = `申请人[${this.get("creater.name")}]取回了车辆[${this.get("car.number")}]的申请单`;
                        break;
                    case "pending":
                        title = "审核通知";
                        icon = "glyphicon-time";
                        color = "text-warning";
                        text = `申请人[${this.get("creater.name")}]提交了车辆[${this.get("car.number")}]的申请单`;
                        break;
                }

            }
            else{
                //没有权限的没有任何通知需要生成
                return;
            }
            let message = this.get("message");
            if(message){
                this.store.unloadRecord(message);
                this.set("message",null);
            }
            if(!title){
                //当没有任何通知时，需要判断是否要生成过期通知（用于申请单已经过期但没有归档或者申请单快要过期时通知用户）
                if(this.get("isFinishing")){
                    title = "过期通知";
                    //这里icon及color为空，是因为过期通知icon及其color是自动根据isFinishing及isFinished判定并加上的
                    icon = "";
                    color = "";
                    if(this.get("isFinished")){
                        text = `车辆[${this.get("car.number")}]有一个申请单已于[${this.get("end_date").format("yyyy-MM-dd")}]过期`;
                    }
                    else{
                        text = `车辆[${this.get("car.number")}]有一个申请单将于[${this.get("end_date").format("yyyy-MM-dd")}]过期`;
                    }
                }
            }
            if(title && lastTrace){
                let message = this.store.createRecord("message", {
                    instance: this,
                    title: title,
                    icon: icon,
                    color: color,
                    text: text,
                    created_date:lastTrace.get("modified_date")
                });
                this.set("message",message);
            }
        });
    })
});
