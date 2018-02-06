import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    car: DS.belongsTo('car',{ async: false }),
    project: DS.belongsTo('project',{ async: false }),
    department: DS.belongsTo('department',{ async: false }),
    user_name: DS.attr('string',{ defaultValue: '' }),
    oils: DS.hasMany('oil',{ async: false,inverse: null }),
    goal: DS.attr('string',{ defaultValue: '' }),
    start_date: DS.attr('date'),
    end_date: DS.attr('date'),
    start_info: DS.attr('string',{ defaultValue: '' }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    projectDidChange:Ember.observer('project',function(){
        let project = this.get("project");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(project)){
                this.get('errors').add('project', '不能为空');
            }
            else{
                this.get('errors').remove('project');
            }
        }
    }),
    departmentDidChange:Ember.observer('department',function(){
        let department = this.get("department");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(department)){
                this.get('errors').add('department', '不能为空');
            }
            else{
                this.get('errors').remove('department');
            }
        }
    }),
    userNameDidChange:Ember.observer('user_name', function() {
        let user_name = this.get("user_name");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            user_name = user_name.trim();
            if(Ember.isEmpty(user_name)){
                this.get('errors').add('user_name', '不能为空');
            }
            else if(user_name.length > 20){
                this.get('errors').add('user_name', '长度不能超过20字符');
            }
        }
    }),
    oilsDidChange:Ember.observer('oils',function(){
        let oils = this.get("oils");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            if(Ember.isEmpty(oils)){
                this.get('errors').add('oils', '请至少选择一个油品');
            }
            else{
                this.get('errors').remove('oils');
            }
        }
    }),
    goalDidChange:Ember.observer('goal',function(){
        let goal = this.get("goal");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            goal = goal.trim();
            if(!Ember.isEmpty(goal) && goal.length > 200){
                this.get('errors').add('goal', '长度不能超过200字符');
            }
        }
    }),
    startEndDateDidChange:Ember.observer('start_date','end_date',function(){
        let start_date = this.get("start_date");
        let end_date = this.get("end_date");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            let now = new Date();
            if(Ember.isEmpty(start_date) || Ember.isEmpty(end_date)){
                this.get('errors').add('start_date', '起止时间都不能为空');
            }
            else if(end_date.getTime()-start_date.getTime() < 0){
                this.get('errors').remove('start_date');
                this.get('errors').add('start_date', '终止时间不能小于起始时间');
            }
            else if(end_date.getTime()-now.getTime() < 0){
                this.get('errors').remove('start_date');
                this.get('errors').add('start_date', '终止时间不能小于当前时间');
            }
            else{
                this.get('errors').remove('start_date');
            }
        }
    }),
    startInfoDidChange:Ember.observer('start_info',function(){
        let start_info = this.get("start_info");
        if(this.get("hasDirtyAttributes") && !this.get("isDeleted")){
            start_info = start_info.trim();
            if(!Ember.isEmpty(start_info) && start_info.length > 200){
                this.get('errors').add('start_info', '长度不能超过200字符');
            }
        }
    })
});
