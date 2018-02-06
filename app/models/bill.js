import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    car: DS.belongsTo('car',{ async: true,inverse: null }),
    instance: DS.belongsTo('instance',{ async: true }),
    project: DS.belongsTo('project',{ async: false }),
    department: DS.belongsTo('department',{ async: false }),
    oil: DS.belongsTo('oil',{ async: false }),
    volume: DS.attr('number'),
    mileage: DS.attr('number'),
    driver_name: DS.attr('string',{ defaultValue: "" }),
    signature: DS.belongsTo('signature',{ async: true }),//签字
    // signature: DS.attr('string',{ defaultValue: "" }),//签字id
    previous_oil: DS.belongsTo('oil',{ async: false }),
    rate: DS.attr('number',{ defaultValue: 0 }),
    oiler: DS.belongsTo('user', { async: false,inverse: null }),//加油工
    time: DS.attr('date'),
    is_lost: DS.attr('boolean', { defaultValue: false }),
    is_printed: DS.attr('boolean', { defaultValue: false }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    modifier: DS.belongsTo('user', { async: false,inverse: null }),
    modified_date: DS.attr('date'),
    volumeDidChange:Ember.observer('volume', function() {
        let volume = this.get("volume");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(volume)){
                this.get('errors').add('volume', '请输入合法数值');
            }
            else if(volume === 0){
                this.get('errors').add('volume', '请输入大于0的数值');
            }
            else if(volume && /^[-]\d+([.]\d{0,})?$/.test(volume)){
                this.get('errors').add('volume', '不允许负数');
            }
            else if(volume && volume.toString().split(".")[0].length > 3){
                this.get('errors').add('volume', '输入整数位过多');
            }
            else if(volume && /^\d+[.]\d{3,}$/.test(volume)){
                this.get('errors').add('volume', '输入小数位过多');
            }
        }
    }),
    mileageDidChange:Ember.observer('mileage', function() {
        let mileage = this.get("mileage");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(mileage)){
                this.get('errors').add('mileage', '请输入合法数值');
            }
            else if(mileage === 0){
                this.get('errors').add('mileage', '请输入大于0的数值');
            }
            else if(mileage && /^[-]\d+([.]\d{0,})?$/.test(mileage)){
                this.get('errors').add('mileage', '不允许负数');
            }
            else if(mileage && /^\d+[.]\d{3,}$/.test(mileage)){
                this.get('errors').add('mileage', '输入小数位过多');
            }
        }
    }),
    // driverNameDidChange:Ember.observer('driver_name', function() {
    //     let driver_name = this.get("driver_name");
    //     if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
    //         driver_name = driver_name.trim();
    //         if(Ember.isEmpty(driver_name)){
    //             this.get('errors').add('driver_name', '不能为空');
    //         }
    //         else if(driver_name.length > 20){
    //             this.get('errors').add('driver_name', '长度不能超过20字符');
    //         }
    //     }
    // }),
    oilerDidChange:Ember.observer('oiler',function(){
        var oiler = this.get("oiler");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(oiler)){
                this.get('errors').add('oiler', '不能为空');
            }
            else{
                this.get('errors').remove('oiler');
            }
        }
    }),
    timeDidChange:Ember.observer('time',function(){
        let time = this.get("time");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(time)){
                this.get('errors').add('time', '加油时间不能为空');
            }
            else if(time instanceof Date){
                if(time.toString().indexOf("Invalid") >= 0){
                    this.get('errors').add('time', '时间格式不正确，请输入类似:2016-06-03 12:23格式的合法时间值');
                }
                else{
                    this.get('errors').remove('time');
                }
            }
            else{
                this.get('errors').add('time', '时间格式不正确，请输入类似:2016-06-03 12:23格式的合法时间值');
            }
        }
    }),
    rateColor:Ember.computed("rate","previous_oil.yellow_rate","previous_oil.red_rate",function(){
        let rate = this.get("rate");
        let yellow_rate = this.get("previous_oil.yellow_rate");
        let red_rate = this.get("previous_oil.red_rate");
        if(rate < 0){
            return "danger";
        }
        if(rate && yellow_rate && red_rate){
            if(rate > red_rate){
                return "danger";
            }
            else if(rate > yellow_rate){
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
    computeRate(){
        let mileage = this.get("mileage");
        // let lastVolume = this.get("car.last_volume");
        let lastVolume = this.get("volume");//油耗计算方法客户觉得用当前加油量作为分子，而不是上一次加油量
        let lastMileage = this.get("car.last_mileage");
        if(lastVolume > 0 && lastMileage > 0){
            let rate = 0;
            if(mileage - lastMileage === 0){
                //两次里程数相同就设置为-999来标记
                rate = -999;
            }
            else{
                rate = window.HOJS.lib.accDiv(lastVolume,mileage - lastMileage) * 100;
                rate = window.HOJS.lib.deci(rate,2);//四舍五入到2位小数
            }
            this.set("rate",rate);
        }
    }
});

