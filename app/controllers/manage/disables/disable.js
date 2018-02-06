import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';
import InstanceListController from '../../../mixins/instance-list/controller';
import InstanceDetailController from '../../../mixins/instance-detail/controller';

export default Ember.Controller.extend(StandardDetailController,InstanceListController,InstanceDetailController,{
    routeName:"manage.disables.disable",
    modelTitle:"车辆",
    parentController:Ember.inject.controller('manage.disables'),
    parentRouteName:"manage.disables",
    isBaseFolded:true,
    isInstancesFolded:false,
    isDisableDidChange:Ember.observer("model.isDisable",function(){
        //当记录被不再为待处理状态时，返回上一个界面，这里的状态变化包括当前用户操作结果及从服务器中push过来的状态变化
        //这里一定要加run.next，因为不加的话，新建instance会先触发isDisable属性的判断，从而无法正确把新的instance加载到car中
        Ember.run.next(()=>{
            let isDisable = this.get("model.isDisable");
            if(!isDisable){
                let currentRouteName = this.get("applicationController.currentRouteName");
                if(currentRouteName === `${this.routeName}.index` || currentRouteName === `${this.routeName}.edit.index`){
                    this.send("goBack");
                }
            }
        });
    }),
    actions:{
    }
});
