import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';

export default Ember.Controller.extend(StandardDetailController,{
    routeName:"history.bills.bill",
    modelTitle:"加油单",
	isPickingProject:false,
	isPickingDepartment:false,
    nameSorting: ['name:asc'],
    arrangedProjects: Ember.computed.sort('all_projects', 'nameSorting'),
    all_projects:Ember.computed(function(){
        return this.store.peekAll("project");
    }),
    arrangedDepartments: Ember.computed.sort('all_departments', 'nameSorting'),
    all_departments:Ember.computed(function(){
        return this.store.peekAll("department");
    }),
    arrangedOils: Ember.computed.sort('all_oils', 'nameSorting'),
    all_oils:Ember.computed(function(){
        return this.get("model.instance.oils");
    }),
    actions:{
        setOil(oil){
            let model = this.get("model");
            model.set("oil",oil);
            model.notifyPropertyChange("isRelationshipsChanged");
        },
        setProject(project){
        	let model = this.get("model");
            model.set("project",project);
            model.notifyPropertyChange("isRelationshipsChanged");
            this.set("isPickUpPopActive",false);
        },
        setDepartment(department){
        	let model = this.get("model");
            model.set("department",department);
            model.notifyPropertyChange("isRelationshipsChanged");
            this.set("isPickUpPopActive",false);
        },
        save(){
            //修改申请单无法准确计算油耗，所以不计算
            // this.get("model").computeRate();
            this._super();
        }
    }
});
