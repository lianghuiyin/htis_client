import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"project",
    routeName:"setting.projects",
    modelTitle:"项目",
    createRecord(){
        var currentUser = this.get("sessionController.user");
        var car = this.store.createRecord(this.modelName, {
            name: `新${this.modelTitle}`,
            is_enable:true,
            creater: currentUser,
            created_date: new Date(),
            modifier: currentUser,
            modified_date: new Date()
        });
        return car;
    }
});
