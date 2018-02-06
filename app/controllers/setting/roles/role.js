import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';

export default Ember.Controller.extend(StandardDetailController,{
    routeName:"setting.roles.role",
    modelTitle:"角色",
    all_powers:Ember.computed(function(){
        return this.store.peekAll("power");
    }),
    actions:{
        checkPower({value,isChecked}){
            if(!this.get("isEditing")){
                return;
            }
            if(isChecked){
                this.get("model.powers").pushObject(value);
            }
            else{
                this.get("model.powers").removeObject(value);
            }
            this.get("model").notifyPropertyChange("isRelationshipsChanged");
        },
        delete(){
            let sessionController = this.get("sessionController");
            if(sessionController.get("user.role") === this.get("model")){
                this.set("customizedMsg","当前用户属于该角色，不能删除");
                this.set("isPickingCustomizedMsg",true);
            }
            else{
                this._super();
            }
        }
    }
});
