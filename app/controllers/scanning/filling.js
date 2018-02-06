import Ember from 'ember';
import NavigablePaneController from '../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    modelName:"bill",
    routeName:"scanning.filling",
    modelTitle:"加油单",
    sessionController:Ember.inject.controller('session'),
    changesetController:Ember.inject.controller('changeset'),
    pannelTitle:Ember.computed("model.car","isFirstStepEditing","isSecondStepEditing","isSigning","isSubmiting",function(){
        let vin = this.get("model.car.vin");
        if(!vin){
            return "获取车辆VIN异常";
        }
        vin = vin.substr(-6);
        if(this.get("isFirstStepEditing") || this.get("isSecondStepEditing")){
            return "新建加油单-" + vin;
        }
        else if(this.get("isSigning")){
            return "驾驶员签字-" + vin;
        }
        else if(this.get("isSubmiting")){
            return "加油员确认-" + vin;
        }
        else{
            return "异常标题";
        }
    }),
    isFirstStepEditing:true,
    isSecondStepEditing:true,
    isSubmiting:false,
    // isPrinting:false,
    // isPrintError:false,
    isConfirmingCancel:false,
    isSignNeeded:Ember.computed("model.signature","sessionController.isSignNeeded",function(){
        if(this.get("sessionController.isSignNeeded")){
            return !this.get("model.signature.content");
        }
        else{
            return false;
        }
    }),
    oils:[],
    // oils:Ember.computed("model.instance","model.instance.oils.length",function(){
    //     return this.get("model.instance.oils");
    // }),
    isSigning:false,
    isSavingSign:false,
    signature:null,
    isPickUpPopActive:false,
    isConfirmed:false,
    confirmCancelTransition:null,
    confirmingCancelMsg:"检测到新建加油单，确定要放弃吗？",
    previousDriverName:"",
    // driverNameDidChange:Ember.observer("model.driver_name",function(){
    //     //如果已签字的情况下修改姓名，则需要重新签字
    //     if(this.get("signature") && this.get("previousDriverName").trim() !== this.get("model.driver_name").trim()){
    //         this.send("resetSignature");
    //     }
    // }),
    actions:{
        resetOptions(){
            this.set("isFirstStepEditing",true);
            this.set("isSecondStepEditing",false);
            this.set("isSubmiting",false);
            this.set("isSavingSign",false);
            // this.set("isPrinting",false);
            // this.set("isPrintError",false);
            this.set("isConfirmingCancel",false);
            this.set("previousDriverName","");
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
            else{
                this.send("goBack");
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
    	setOil(oil){
    		this.set("model.oil",oil);
    	},
        goNext(){
            let model = this.get("model");
            model.notifyPropertyChange("mileage");
            // model.notifyPropertyChange("driver_name");
            // if(!model.get("errors").has("mileage") && !model.get("errors").has("driver_name")){
            if(!model.get("errors").has("mileage")){
                this.set("isFirstStepEditing",false);
                this.set("isSecondStepEditing",true);
            }
        },
    	confirmToSubmit(){
    		let model = this.get("model");
            model.notifyPropertyChange("volume");
    		if(model.get("errors.length") === 0){
                model.computeRate();
    			this.set("isSecondStepEditing",false);
                this.set("isSubmiting",true);
    		}
    	},
        cancelToPrevious(){
            this.set("isFirstStepEditing",true);
            this.set("isSecondStepEditing",false);
            //每次返回到上一步前要记录driver_name值，以备比较是否有变化
            // this.set("previousDriverName",this.get("model.driver_name"));
        },
        goSigning(){
            if(this.get("isSigning")){
                return;
            }
            this.set("isWaitingFocusForSign",true);
            //这里要增加run.next及run.later的原因是手机上如果键盘没有下去会造成不能全屏打开签字板，所以只能延时等待
            Ember.run.next(()=>{
                this.send("createSignature");
                Ember.run.later(()=>{
                    this.set("isWaitingFocusForSign",false);
                    this.set("isSigning",true);
                },2000);
            });
        },
        createSignature(){
            let model = this.get("model");
            let currentUser = this.get("sessionController.user");
            let signature = this.store.createRecord("signature", {
                name: model.get("driver_name"),
                creater: currentUser,
                created_date: new Date()
            });
            this.set("signature",signature);
        },
        resetCanvas(){
            this.get("model.errors").remove("signature");
            this.get("signature.errors").clear();
        },
        cancelSigning(){
            this.get("signature").rollbackAttributes();
            this.set("signature",null);
            this.get("model.errors").remove("signature");
            this.set("isSigning",false);
        },
        submit(base64,dataLength){
            let model = this.get("model");
            if(dataLength < 10){
                model.get("errors").add("signature","不能为空");
                return;
            }
            model.get("errors").remove("signature");
            let signature = this.get("signature");
            signature.set("sign",base64);
            this.set("isSavingSign",true);
            signature.save().then(()=>{
                this.set("isSavingSign",false);
                model.set("signature",signature);
                model.notifyPropertyChange("signature");
                if(!model.get("errors").has("signature")){
                    this.set("isSigning",false);
                }
            },()=>{
                this.set("isSavingSign",false);
            });
        },
        cancelSubmit(){
            let model = this.get("model");
            this.send("clearError",model);
            this.send("resetSignature");
            this.set("isSubmiting",false);
            this.set("isSecondStepEditing",true);
        },
        abort(){
            //中断提交图片请求，当图片提交请求很长很卡时，可以通过这个操作快速中断并提供重新提交机会
            //因为无法找到promise的abort函数及实现真正意义上的中断请求，所以这里只能把signature对象删除并重新生成
            this.get("signature").rollbackAttributes();
            this.set("signature",null);
            this.get("model.errors").remove("signature");
            this.send("createSignature");
            this.set("isSavingSign",false);
        },
        resetSignature(){
            let model = this.get("model");
            let signature = this.get("signature");
            if(signature){
                if(!signature.get("isDeleted")){
                    signature.deleteRecord();
                    signature.save();
                }
                model.set("signature",null);
                model.notifyPropertyChange("signature");
                this.set("signature",null);
            }
        },
        save(){
            let currentUser = this.get("sessionController.user");
            let isBillLosePowered = this.get("sessionController.isBillLosePowered");
            if(isBillLosePowered){
                this.set("model.is_lost",true);
            }
            this.set("model.modifier",currentUser);
            this.get("model").save().then((answer)=>{
                let changesetController = this.get("changesetController");
                changesetController.get("billsForPrint").push(answer.get("id"));
                this.set("isSubmiting",false);
                this.send("goBack");
            },()=>{
            });
        },
        clearError(model){
            model.get("errors").remove("server_side_error");
        },
        clearErrorForSignature(){
            this.get("model.errors").remove("signature");
        }
    }
});
