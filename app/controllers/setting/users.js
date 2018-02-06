import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"user",
    routeName:"setting.users",
    modelTitle:"用户",
    searchPlaceholder:"输入名称、手机号、邮箱地址或角色搜索",
    createRecord(){
        var currentUser = this.get("sessionController.user");
        var car = this.store.createRecord(this.modelName, {
            name: `新${this.modelTitle}`,
            phone:'',
            email:'',
            signature: '',
            creater: currentUser,
            created_date: new Date(),
            modifier: currentUser,
            modified_date: new Date()
        });
        return car;
    }
});
