import Ember from 'ember';
import DS from 'ember-data';
import NavigablePaneController from '../../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"history.reports.filter",
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    parentController:Ember.inject.controller('history.reports'),
    pannelTitle:"搜索条件设置",
    isSearching:false,
    isUnSavable:false,
    project:null,
    department:null,
    startDate:null,
    endDate:null,
    errors:DS.Errors.create(),
    isTimeResetNeeded:false,
    nameSorting: ['name:asc'],
    arrangedProjects: Ember.computed.sort('all_projects', 'nameSorting'),
    all_projects:Ember.computed(function(){
        return this.store.peekAll("project");
    }),
    arrangedDepartments: Ember.computed.sort('all_departments', 'nameSorting'),
    all_departments:Ember.computed(function(){
        return this.store.peekAll("department");
    }),
    actions:{
        setProject(project){
            this.set("project",project);
            this.set("isPickUpPopActive",false);
        },
        setDepartment(department){
            this.set("department",department);
            this.set("isPickUpPopActive",false);
        },
        syncOption(filterOption){
            if(filterOption){
                Ember.run.next(()=>{
                    this.set("project",filterOption.get("project"));
                    this.set("department",filterOption.get("department"));
                    let startDate = filterOption.get("startDate");
                    if(startDate){
                        this.set("startDate",startDate);
                    }
                    let endDate = filterOption.get("endDate");
                    if(endDate){
                        this.set("endDate",endDate);
                    }
                });
            }
            else{
                this.set("project",null);
                this.set("department",null);
                let now = new Date();
                let startDate = window.HOJS.lib.parseDate(now.format('yyyy-MM-dd 00:00:00'));
                this.set("startDate",startDate);
                let endDate = window.HOJS.lib.parseDate(now.format('yyyy-MM-dd 23:59:59'));
                this.set("endDate",endDate);
            }
        },
        search(){
            let parentController = this.get("parentController");
            let project = this.get("project");
            let department = this.get("department");
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            parentController.send("clearReports");
            let filterOption = Ember.Object.create({
                project:project,
                department:department,
                startDate:startDate,
                endDate:endDate
            });
            parentController.set("filterOption",filterOption);
            this.get("errors").remove('server_side_error');
            this.set("isSearching",true);
            this.store.query('report',{
                project:project ? project.get("id") : null,
                department:department ? department.get("id") : null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss')
            }).then(()=>{
                this.set("isSearching",false);
                this.send("goBack");
            },(reason)=>{
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "该资源不存在或网络繁忙，请稍候再试";
                }
                let recordErrors = this.get("errors");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isSearching",false);
            });
        },
        reset(){
            let parentController = this.get("parentController");
            parentController.send("clearReports");
            parentController.set("filterOption",null);
            this.send("syncOption",null);
            this.toggleProperty("isTimeResetNeeded",true);//通知时间控件重置界面值
        }
    }
});
