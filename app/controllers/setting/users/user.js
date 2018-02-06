import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';

export default Ember.Controller.extend(StandardDetailController,{
    routeName:"setting.users.user",
    modelTitle:"用户",
    roles:Ember.computed(function(){
        return this.store.peekAll("role");
    }),
    enableList:[{
        name:'启用',
        value:true
    },{
        name:'禁用',
        value:false
    }],
    isSignNeededList:[{
        name:'需要',
        value:true
    },{
        name:'不需要',
        value:false
    }],
    actions:{
    	setRole(role){
    		this.set("model.role",role);
            this.get("model").notifyPropertyChange("isRelationshipsChanged");
            this.set("isPickUpPopActive",false);
    	},
        setIsSignNeeded(value){
            this.set("model.is_sign_needed",value);
        },
        setIsEnable(value){
            this.set("model.is_enable",value);
        },
        delete(){
            let sessionController = this.get("sessionController");
            if(sessionController.get("user") === this.get("model")){
                this.set("customizedMsg","您不能删除自己的账户");
                this.set("isPickingCustomizedMsg",true);
            }
            else if(this.get("model.id").toString() === "1"){
                this.set("customizedMsg","不能删除初始账户");
                this.set("isPickingCustomizedMsg",true);
            }
            else{
                this._super();
            }
        }
    }
});
