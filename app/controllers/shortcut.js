import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
	applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    routeName:"shortcut",
    pannelTitle:"快捷打印",
    isPicking:false,
    isPickUpPopActive:false,
    errorsForReports:DS.Errors.create(),
    errorsForBills:DS.Errors.create(),
    isSearchingReports:false,
    isSearchingBills:false,
    isExporting:false,
    totalCount:0,
    startDate:null,
    endDate:null,
    isTimeResetNeeded:false,
    settingOptions:{
        startDate:null,
        endDate:null,
    },
    settingDateFormat:Ember.computed("applicationController.shortcutHour",function(){
        return `yyyy-MM-dd ${this.get("applicationController.shortcutHour")}:00:00`;
    }),
    settingWarningText:Ember.computed("settingOptions.startDate","settingOptions.endDate",function(){
        let splitDates = this.getDateFromSetting();
        let startDate = splitDates.startDate;
        let endDate = splitDates.endDate;
        if(startDate && endDate){
            if(window.HOJS.lib.dateDiff("H",startDate,endDate) > 24){
                return "时间范围超过24小时可能造成服务器繁忙甚至卡顿，请尽量把范围设置在24小时内。";
            }
            else{
                return "";
            }
        }
        else{
            return "";
        }
    }),
    filterText:Ember.computed("startDate","endDate",function(){
        return `时间范围为[${this.get("startDate").format('yyyy-MM-dd hh:mm:ss')}➡${this.get("endDate").format('yyyy-MM-dd hh:mm:ss')}]`;
    }),
    allProjects:Ember.computed(function(){
        return this.store.peekAll("project");
    }),
    allDepartments:Ember.computed(function(){
        return this.store.peekAll("department");
    }),
    allOils:Ember.computed(function(){
        return this.store.peekAll("oil");
    }),
    projects:Ember.computed("reports.length","allProjects.length",function(){
        let reports = this.get("reports");
        let allProjects = this.get("allProjects");
        let projects = allProjects.filter(function(project){
            return reports.filterBy("project.id",project.get("id")).length;
        });
        return projects;
    }),
    departments:Ember.computed("reports.length","allDepartments.length",function(){
        let reports = this.get("reports");
        let allDepartments = this.get("allDepartments");
        let departments = allDepartments.filter(function(department){
            return reports.filterBy("department.id",department.get("id")).length;
        });
        return departments;
    }),
    oils:Ember.computed("reports.length","allOils.length",function(){
        let reports = this.get("reports");
        let allOils = this.get("allOils");
        let oils = allOils.filter(function(oil){
            return reports.filterBy("oil.id",oil.get("id")).length;
        });
        return oils;
    }),
    reports:Ember.computed(function(){
    	return this.store.peekAll("report");
    }),
    bills:Ember.computed(function(){
    	return this.store.peekAll("bill");
    }),
    getDateBySplitHour(){
        let reDate = {};
        let splitHour = this.get("applicationController.shortcutHour");
        let now = new Date();
        let splitDate = window.HOJS.lib.parseDate((now).format(`yyyy-MM-dd ${splitHour}:00:00`));
        let splitNowDate = window.HOJS.lib.parseDate(splitDate.format('yyyy-MM-dd hh:mm:ss'));
        let split24HourAgo = window.HOJS.lib.parseDate(splitDate.addHours(-24).format('yyyy-MM-dd hh:mm:ss'));
        let split48HourAgo = window.HOJS.lib.parseDate(splitDate.addHours(-24).format('yyyy-MM-dd hh:mm:ss'));
        if(now.getTime() > splitDate.getTime()){
            reDate.startDate = split24HourAgo;
            reDate.endDate = splitNowDate;
        }
        else{
            reDate.startDate = split48HourAgo;
            reDate.endDate = split24HourAgo;
        }
        return reDate;
    },
    getDateFromSetting(){
        let reDate = {};
        let splitHour = this.get("applicationController.shortcutHour");
        reDate.startDate = window.HOJS.lib.parseDate(this.get("settingOptions.startDate").format(`yyyy-MM-dd ${splitHour}:00:00`));
        reDate.endDate = window.HOJS.lib.parseDate(this.get("settingOptions.endDate").format(`yyyy-MM-dd ${splitHour}:00:00`));
        return reDate;
    },
    actions:{
        clearReportsAndBills(){
            this.store.unloadAll("report");
            this.store.unloadAll("bill");
            this.store.unloadAll("signature");
        },
        clearReports(){
            this.store.unloadAll("report");
        },
        clearBills(){
            this.store.unloadAll("bill");
            this.store.unloadAll("signature");
        },
	    loadReports(isFirst){
            this.send("clearReports");
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            this.get("errorsForReports").remove('server_side_error');
            this.set("isSearchingReports",true);
            this.store.query('report',{
                project:null,
                department:null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss')
            }).then(()=>{
                this.set("isSearchingReports",false);
                if(isFirst){
                    this.send("loadBills");
                }
            },(reason)=>{
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "该资源不存在或网络繁忙，请稍候再试";
                }
                let recordErrors = this.get("errorsForReports");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isSearchingReports",false);
                if(isFirst){
                    this.send("loadBills");
                }
            });
	    },
	    loadBills(){
            this.send("clearBills");
            this.set("totalCount",0);
            let startDate = this.get("startDate");
            let endDate = this.get("endDate");
            this.get("errorsForBills").remove('server_side_error');
            this.set("isSearchingBills",true);
            this.store.query('bill',{
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss')
            }).then((answer)=>{
                this.set("totalCount",answer.toArray().length);
                this.set("isSearchingBills",false);
            },(reason)=>{
                this.set("totalCount",0);
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "该资源不存在或网络繁忙，请稍候再试";
                }
                let recordErrors = this.get("errorsForBills");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isSearchingBills",false);
            });
	    },
        setDateBySplitHour(){
            let dateBySplitHour = this.getDateBySplitHour();
            this.set("startDate",dateBySplitHour.startDate);
            this.set("endDate",dateBySplitHour.endDate);
        },
	    loadData(){
            this.send("setDateBySplitHour");
            this.set("isSearchingReports",true);
            this.set("isSearchingBills",true);
	    	this.send("loadReports",true);
	    },
        clearPop(){
            this.set("isPickUpPopActive",false);
        },
        syncSettingOptions(startDate,endDate){
            this.set("settingOptions.startDate",startDate);
            this.set("settingOptions.endDate",endDate);
            this.toggleProperty("isTimeResetNeeded",true);//通知时间控件重置界面值
        },
        openSetting(){
            this.set("isPicking",true);
            this.send("syncSettingOptions",this.get("startDate"),this.get("endDate"));
        },
        setDateFromSetting(){
            this.send("clearPop");
            let splitDates = this.getDateFromSetting();
            this.set("startDate",splitDates.startDate);
            this.set("endDate",splitDates.endDate);
            this.set("isSearchingReports",true);
            this.set("isSearchingBills",true);
            this.send("loadReports",true);
        },
        reset(){
            let dateBySplitHour = this.getDateBySplitHour();
            this.send("syncSettingOptions",dateBySplitHour.startDate,dateBySplitHour.endDate);
        },
        export(){
            let table2excel = window.$(".table2excel").clone();
            table2excel.find("td").css("text-align","center");
            let fileName = this.get("applicationController.appTitle") + "-" + this.get("pannelTitle") + "-" + this.get("filterText");
            table2excel.table2excel({
                fileName: fileName,
                fileExt: ".xls"
            });
            table2excel = null;
        }
    }
});
