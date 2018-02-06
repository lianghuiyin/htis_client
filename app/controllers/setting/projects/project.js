import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';

export default Ember.Controller.extend(StandardDetailController,{
    routeName:"setting.projects.project",
    modelTitle:"项目",
    enableList:[{
    	name:'启用',
    	value:true
    },{
    	name:'禁用',
    	value:false
    }],
    actions:{
    	setIsEnable(value){
    		this.set("model.is_enable",value);
    	}
    }
});
