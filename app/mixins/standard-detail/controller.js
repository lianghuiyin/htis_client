import Ember from 'ember';
import FitPaneController from '../../mixins/fit-pane/controller';

export default Ember.Mixin.create(FitPaneController,{
    routeName:"",//setting.roles.role
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    parentController:null,
    parentRouteName:"",
    equipment: Ember.inject.service('equipment'),
    modelTitle:"",//角色
    pannelTitle:Ember.computed('isEditing','isNew',function(){
        if(this.get('isNew')){
            return `新建${this.get("modelTitle")}`;
        }
        else if(this.get('isEditing')){
            return `修改${this.get("modelTitle")}信息`;
        }
        else{
            return `${this.get("modelTitle")}信息`;
        }
    }),
    confirmingCancelMsg:Ember.computed('isNew',function(){
        if(this.get('isNew')){
            return "确定要放弃新建记录吗？";
        }
        else{
            return "记录已被修改，确定要放弃修改吗？";
        }
    }),
	isActive:false,
	isBack:false,
    isEditing:false,
    isNew:false,
    isPicking:false,
    isPickUpPopActive:false,
    isConfirmingCancel:false,
    isConfirmingDelete:false,
    isPickingCustomizedMsg:false,
    customizedMsg:"",
    isConfirmed:false,
    isPickingError:false,
    confirmCancelTransition:null,
    // runLaterForHide:null,
    // isBackDidChange:Ember.observer("isBack",function(){
    //     //退出后要把div隐藏来减少内存消耗
    //     if(this.get("isBack")){
    //         if(Ember.$.support.transition){
    //             Ember.run.cancel(this.runLaterForHide);
    //             this.runLaterForHide = Ember.run.later(()=>{
    //                 if(this.get("isBack")){
    //                     this.set("isHide",true);
    //                 }
    //             },3000);
    //         }
    //         else{
    //             this.set("isHide",true);
    //         }
    //     }
    // }),
    // equipmentIsXsDidChange:Ember.observer("equipment.isXs",function(){
    //     //当浏览器大小在手机模式与非手机模式中变换时需要做调整来自动适应布局
    //     if(this.get("equipment.isXs")){
    //         let currentRouteName = this.target.currentRouteName;
    //         let isChildRoute = currentRouteName.indexOf(this.parentRouteName) >= 0 && currentRouteName !== `${this.parentRouteName}.index`;
    //         if(isChildRoute && !this.get("parentController.isBack")){
    //             this.set("parentController.isBack",true);
    //         }
    //     }
    //     else{
    //         if(this.get("parentController.isBack")){
    //             this.set("parentController.isHide",false);
    //             this.set("parentController.isBack",false);
    //         }
    //     }
    // }),
    currentStateName:Ember.computed.oneWay("model.currentState.stateName"),
    afterRecordIsDeleted:Ember.observer("currentStateName",function(){
        //当记录被删除时，返回上一个界面，这里的删除包括当前用户删除及从服务器中push过来的删除
        var currentStateName = this.get("currentStateName");
        if(currentStateName === "root.deleted.saved"){
            var currentRouteName = this.get("applicationController.currentRouteName");
            if(currentRouteName === `${this.routeName}.index` || currentRouteName === `${this.routeName}.edit` || currentRouteName === `${this.routeName}.edit.index`){
                this.send("goBack");
            }
        }
    }),
    isNeedToShowFix:Ember.computed('isNew','isEditing', function() {
        return !(this.get("isNew") || this.get("isEditing"));
    }),
    isServerSideErrorDidChange:Ember.observer("model.errors.server_side_error.length",function(){
        if(this.get("model.errors.server_side_error.length")){
            this.set("isPickingError",true);
        }
    }),
    actions:{
        edit() {
            this.send("goEdit");
        },
        save(){
            let currentUser = this.get("sessionController.user");
            this.set("model.modifier",currentUser);
            var isNew = this.get("isNew");
            this.get('model').save().then(()=>{
                if(isNew){
                    this.send("goBack");
                }
                else{
                    this.send("goIndex");
                }
            }, ()=>{
            });
        },
        showCancelConfirm(transition){
            this.set("confirmCancelTransition",transition);
            this.set("isConfirmingCancel",true);
        },
        cancel(){
            let confirmCancelTransition = this.get("confirmCancelTransition");
            if(confirmCancelTransition){
                confirmCancelTransition.retry();
            }
            else if(this.get("isNew")){
                this.send("goBack");
            }
            else{
                this.send("goIndex");
            }
        },
        doCancel(isDo){
            this.set("isPickUpPopActive",false);//该属性会自动同步isConfirmingCancel为False
            // this.set("isConfirmingCancel",false);
            this.set("isConfirmed",isDo);
            if(isDo){
                this.send("cancel");
            }
            else{
                this.set("confirmCancelTransition",null);
            }
        },
        delete(){
            this.set("isConfirmingDelete",true);
        },
        doDelete(isDo){
            if(isDo){
                //这里不可以通过isPickUpPopActive来同步，因为记录被删除后同步属性会报错
                this.set("isConfirmingDelete",false);
                this.get("model").deleteRecord();
                this.get("model").save().then(()=>{
                }, ()=>{
                });
            }
            else{
                this.set("isPickUpPopActive",false);//该属性会自动同步isConfirmingDelete为False
            }
        },
        clearPop(){
            this.set("isPickUpPopActive",false);
        },
        clearError(model){
            this.set("isPickUpPopActive",false);
            model.get("errors").remove("server_side_error");
        }
    }
});
