import Ember from 'ember';
import DS from 'ember-data';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    applicationController:Ember.inject.controller('application'),
    modelName:"report",
    routeName:"history.reports",
    modelTitle:"加油单报表",
    parentController:Ember.inject.controller('history'),
    parentRouteName:"history",
    pannelTitle:"加油单报表",
    allArrangedResult: null,
    arrangedResult:null,
    filteredResult:null,
    filterOption:null,
    errors:DS.Errors.create(),
    isExporting:false,
    filterText:Ember.computed("filterOption",function(){
        let filterOption = this.get("filterOption");
        if(filterOption){
            let projectText = filterOption.get("project.name");
            let departmentText = filterOption.get("department.name");
            let results = [];
            if(projectText){
                results.push(`项目为[${projectText}]`);
            }
            if(departmentText){
                results.push(`部门为[${departmentText}]`);
            }
            results.push(`时间范围为[${filterOption.get("startDate").format('yyyy-MM-dd')}➡${filterOption.get("endDate").format('yyyy-MM-dd')}]`);
            return results.join(",");
        }
        else{
            return "";
        }
    }),
    isFiltered:Ember.computed("filterOption",function(){
        return this.get("filterOption") !== null;
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
    projects:Ember.computed("model.length","allProjects.length",function(){
        let model = this.get("model");
        let allProjects = this.get("allProjects");
        let projects = allProjects.filter(function(project){
            return model.filterBy("project.id",project.get("id")).length;
        });
        return projects;
    }),
    departments:Ember.computed("model.length","allDepartments.length",function(){
        let model = this.get("model");
        let allDepartments = this.get("allDepartments");
        let departments = allDepartments.filter(function(department){
            return model.filterBy("department.id",department.get("id")).length;
        });
        return departments;
    }),
    oils:Ember.computed("model.length","allOils.length",function(){
        let model = this.get("model");
        let allOils = this.get("allOils");
        let oils = allOils.filter(function(oil){
            return model.filterBy("oil.id",oil.get("id")).length;
        });
        return oils;
    }),
    actions:{
    	filter(){
    		this.send("goFilter");
    	},
        clearReports(){
            this.store.unloadAll("report");
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
