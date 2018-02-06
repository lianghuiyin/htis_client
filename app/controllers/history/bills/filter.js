import Ember from 'ember';
import DS from 'ember-data';
import NavigablePaneController from '../../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"history.bills.filter",
    equipment: Ember.inject.service('equipment'),
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    parentController:Ember.inject.controller('history.bills'),
    pannelTitle:"搜索条件设置",
    isSearching:false,
    isUnSavable:false,
    project:null,
    department:null,
    startDate:null,
    endDate:null,
    errors:DS.Errors.create(),
    isTimeResetNeeded:false,
    isConfirmingExport:false,
    isFetchingCountForExport:false,
    isExporting:false,
    isExportAbort:false,
    totalLength:0,//要导出的加油单总个数
    downloadedLength:0,//已导出加油单个数
    downloadedPercent:0,//已导出百分比
    lastIdForExport:0,//导出时标记翻页用的最大ID值
    pageCountForExport:1200,
    fileNameForExport:"",
    fileUrlForExport:"",
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
        clearError(){
            this.get("errors").remove('server_side_error');
        },
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
            let pageCount = parentController.get("pageCount");
            let project = this.get("project");
            let department = this.get("department");
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            parentController.send("clearBills");
            parentController.set("searchKey","");
            parentController.set("lastId",0);
            let filterOption = Ember.Object.create({
                project:project,
                department:department,
                startDate:startDate,
                endDate:endDate
            });
            parentController.set("filterOption",filterOption);
            this.send("clearError");
            this.set("isSearching",true);
            this.store.query('bill',{
                count:pageCount,
                project:project ? project.get("id") : null,
                department:department ? department.get("id") : null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss'),
                lastId:0
            }).then((answer)=>{
                let bills = answer.toArray();
                if(bills.length > 0){
                    let maxId = bills.mapBy("id").sort(function(a,b){
                        return parseInt(a) - parseInt(b);
                    }).get("lastObject");
                    parentController.set("lastId",maxId);
                }
                if(bills.length < pageCount){
                    parentController.set("isMoreButtonNeeded",false);
                }
                else{
                    parentController.set("isMoreButtonNeeded",true);
                }
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
            parentController.send("clearBills");
            parentController.set("filterOption",null);
            this.send("syncOption",null);
            this.toggleProperty("isTimeResetNeeded",true);//通知时间控件重置界面值
        },
        goExport(){
            let project = this.get("project");
            let department = this.get("department");
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            this.send("clearError");
            this.set("isExportAbort",false);
            this.set("isFetchingCountForExport",true);
            this.store.query('export',{
                project:project ? project.get("id") : null,
                department:department ? department.get("id") : null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss')
            }).then((answer)=>{
                let reExport = answer.toArray().get("firstObject");
                let total = reExport.get("total");
                this.set("totalLength",total);
                this.set("isFetchingCountForExport",false);
                this.set("isConfirmingExport",true);
            },(reason)=>{
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "导出数据时出错，未扑捉到的异常";
                }
                let recordErrors = this.get("errors");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isFetchingCountForExport",false);
            });
        },
        cancelExport(){
            this.beginPropertyChanges();
            this.set("isFetchingCountForExport",false);
            this.set("isConfirmingExport",false);
            this.set("isExporting",false);
            this.set("totalLength",0);
            this.set("downloadedLength",0);
            this.set("downloadedPercent",0);
            this.set("lastIdForExport",0);
            this.set("isExportAbort",true);
            this.endPropertyChanges();
            this.send("clearError");
        },
        export(option){
            if(this.get("isExportAbort")){
                this.beginPropertyChanges();
                this.set("isExporting",false);
                this.set("isConfirmingExport",false);
                this.endPropertyChanges();
                return;
            }
            let pageCount = this.get("pageCountForExport");
            let project = this.get("project");
            let department = this.get("department");
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            if(option && option.isFromSpinButton){
                //点击按钮第一次导出（导出第一页）
                let fileName = `export-bills-${project ? project.get("name") : "none"}-${department ? department.get("name") : "none"}-[${startDate.format('yyyy-MM-dd')}=${endDate.format('yyyy-MM-dd')}]-`;
                fileName += this.get("sessionController.userId");
                fileName += Math.random(new Date()).toString().split(".")[1];
                this.beginPropertyChanges();
                this.set("fileNameForExport",fileName);
                this.set("lastIdForExport",0);
                this.set("fileUrlForExport",`server/download/${fileName}.csv`);
                this.set("downloadedLength",0);
                this.set("downloadedPercent",0);
                this.endPropertyChanges();
            }
            let lastIdForExport = this.get("lastIdForExport");
            let fileNameForExport = this.get("fileNameForExport");
            this.send("clearError");
            this.set("isExporting",true);
            this.store.query('export',{
                count:pageCount,
                project:project ? project.get("id") : null,
                department:department ? department.get("id") : null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss'),
                lastId:lastIdForExport,
                name:fileNameForExport
            }).then((answer)=>{
                let reExport = answer.toArray().get("firstObject");
                let length = reExport.get("length");
                let lastId = reExport.get("last_id");
                let totalLength = this.get("totalLength");
                let newDownloadedLength = this.get("downloadedLength") + length;
                this.beginPropertyChanges();
                this.set("lastIdForExport",lastId);
                this.set("downloadedLength",newDownloadedLength);
                this.set("downloadedPercent",(newDownloadedLength * 100)/totalLength);
                this.endPropertyChanges();
                if(length < pageCount){
                    this.beginPropertyChanges();
                    this.set("isExporting",false);
                    this.set("isConfirmingExport",false);
                    this.endPropertyChanges();
                    let fileNameForExport = this.get("fileNameForExport") + ".csv";
                    let namespace = this.container.lookup("adapter:application").get("namespace");
                    window.$(`<a href = "/${namespace}/downloads?name=${fileNameForExport}" class = 'hidden'><span>testlink</span></a>`).appendTo("body").find("span").trigger("click").end().remove();

                    // let fileUrlForExport = this.get("fileUrlForExport");
                    // window.$(`<a href = ${fileUrlForExport} class = 'hidden'><span>testlink</span></a>`).appendTo("body").find("span").trigger("click").end().remove();
                }
                else{
                    Ember.run.later(()=>{
                        this.send("export");
                    },2000);
                }
            },(reason)=>{
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "导出数据时出错，未扑捉到的异常";
                }
                let recordErrors = this.get("errors");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isExporting",false);
            });
        },
    }
});
