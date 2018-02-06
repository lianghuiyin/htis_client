import Ember from 'ember';

export default Ember.Mixin.create({
    isPickUpPopActive:false,
    confirmingCancelMsg:Ember.computed("isNew","isCreatingInstance","isCreatingTrace","isRecapturing","isChecking","isForbidding","isEnabling","isAborting","isArchiving",function(){
        if(this.get("isCreatingInstance")){
            return "检测到新建申请单，是否要放弃？";
        }
        else if(this.get("isCreatingTrace")){
            return "检测到正在修改申请单，是否要放弃？";
        }
        else if(this.get("isRecapturing")){
            return "检测到正在取回申请单，是否要放弃？";
        }
        else if(this.get("isChecking")){
            return "检测到正在审核申请单，是否要放弃？";
        }
        else if(this.get("isForbidding")){
            return "检测到正在暂停申请单，是否要放弃？";
        }
        else if(this.get("isEnabling")){
            return "检测到正在恢复申请单，是否要放弃？";
        }
        else if(this.get("isAborting")){
            return "检测到正在中止申请单，是否要放弃？";
        }
        else if(this.get("isArchiving")){
            return "检测到正在结束申请单，是否要放弃？";
        }
        else if(this.get("isCarArchiving")){
            return "检测到正在闲置车辆，是否要放弃？";
        }
        else if(this.get("isCarRestoring")){
            return "检测到正在还原车辆，是否要放弃？";
        }
        else{
            return this._super();
        }
    }),
    isCreatingInstance:false,
    creatingInstance:null,
    isCreatingTrace:false,
    creatingTrace:null,
    // selectionEidtableDidChange:Ember.observer("selection.is_pending","selection.is_archived",function(){
    //     //当creatingTrace所属instance即selection从可修改状态变成不可修改状态时（其他用户修改了申请单并push到当前客户端）
    //     //如果正好在修改申请单（即isCreatingTrace为true，creatingTrace不为null），
    //     //需要变更其状态，让正在修改的申请单撤销修改操作及界面
    //     let instance = this.get("selection");
    //     if(!this.get("isCreatingTrace")){
    //         return;
    //     }
    //     if(instance.get("is_pending") || instance.get("is_archived")){
    //         //从可修改状态变成不可修改，则撤销修改
    //         this.send("cancelCreatingTrace");
    //     }
    // }),
    changeTags:[],
    isRecheckNeeded:Ember.computed("changeTags.length","creatingTrace.start_date","creatingTrace.end_date",function(){ 
        let instance = this.get("selection");
        if(!instance.get("is_released")){
            //没有发布则一定要提交审核
            return true;
        }
        //可加油的，根据是否修改了敏感信息来判断是否需要重新提交审核
        let changeTags = this.get("changeTags");
        let isSubmitable = changeTags.any((n)=>{
            return ["所属项目","使用部门","使用人","油品"].contains(n);
        });
        if(isSubmitable){
            return true;
        }
        else{
            let creatingTrace = this.get("creatingTrace");
            if(changeTags.contains("起始时间")){
                if(creatingTrace.get("start_date").getTime() < instance.get("start_date").getTime()){
                    //开始时间改小了，即时间范围变大了，需要重新提交审核
                    isSubmitable = true;
                }
            }
            if(isSubmitable){
                return true;
            }
            else{
                if(changeTags.contains("终止时间")){
                    if(creatingTrace.get("end_date").getTime() > instance.get("end_date").getTime()){
                        //终止时间改大了，即时间范围变大了，需要重新提交审核
                        isSubmitable = true;
                    }
                }
            }
            return isSubmitable;
        }
    }),
    isRecheckNeededDidChange:Ember.observer("isRecheckNeeded","isCreatingTrace",function(){
        let creatingTrace = this.get("creatingTrace");
        if(!creatingTrace){
            return;
        }
        if(this.get("isRecheckNeeded")){
            creatingTrace.set("status","pending");
        }
        else{
            creatingTrace.set("status","modified");
        }
    }),
    isCreatingTraceUnSavable:Ember.computed.not("changeTags.length"),
    isRecapturing:false,
    recapturingTrace:null,
    isArchiving:false,
    archivingInstance:null,
    isArchivable:Ember.computed("selection.is_released","selection.is_enable",function(){
        //只有未发布或已暂停的申请单可以归档
        //对于可加油的申请单只要结束时间小于当前服务器时间即可归档
        let instance = this.get("selection");
        let isArchivable = !instance.get("is_released") || !instance.get("is_enable");
        if(isArchivable){
            return true;
        }
        else{
            let syncToken = this.get("applicationController.syncToken");
            if(instance.get("end_date").getTime() - syncToken.getTime() < 0){
                isArchivable = true;
            }
            return isArchivable;
        }
    }),
    isCarArchiving:false,
    archivingCar:null,
    isCarRestoring:false,
    restoringCar:null,
    isForbidding:false,
    forbiddingModel:null,
    // selectionForbidableDidChange:Ember.observer("selection.isForbidable",function(){
    //     //当forbiddingModel所属instance即selection从可暂停变成不可暂停时（其他用户修改了申请单并push到当前客户端）
    //     //如果正好在暂停申请单（即isForbidding为true，forbiddingModel不为null），
    //     //需要变更其状态，让正在暂停的申请单撤销暂停操作及界面
    //     let instance = this.get("selection");
    //     if(!this.get("isForbidding")){
    //         return;
    //     }
    //     if(!instance.get("isForbidable")){
    //         //从可暂停变成不可暂停，则撤销暂停
    //         this.send("cancelForbidding");
    //     }
    // }),
    isEnabling:false,
    enablingModel:null,
    // selectionEnableDidChange:Ember.observer("selection.is_enable",function(){
    //     //当forbiddingModel所属instance即selection从可暂停变成不可暂停时（其他用户修改了申请单并push到当前客户端）
    //     //如果正好在暂停申请单（即isForbidding为true，forbiddingModel不为null），
    //     //需要变更其状态，让正在暂停的申请单撤销暂停操作及界面
    //     let instance = this.get("selection");
    //     if(!this.get("isEnabling")){
    //         return;
    //     }
    //     if(instance.get("is_enable")){
    //         //从可恢复变成不可恢复，则撤销恢复
    //         this.send("cancelEnabling");
    //     }
    // }),
    isChecking:false,
    checkingModel:null,
    isApproved:true,
    checkText:"",
    isUnCheckable:Ember.computed("isApproved","checkText",function(){
        if(this.get("isApproved")){
            return false;
        }
        else{
            return this.get("checkText").trim().length === 0;
        }
    }),
    isApprovedDidChange:Ember.observer("isApproved",function(){
        this.set("checkText","");
    }),
    checkRadioList:[{
        name:'核准',
        value:true
    },{
        name:'驳回',
        value:false
    }],
    isPickingProjectForInstance:false,
    isPickingDepartmentForInstance:false,
    isPickingProjectForTrace:false,
    isPickingDepartmentForTrace:false,
    isChecker:Ember.computed("sessionController.isInstanceCheckPowered",function(){
        return this.get("sessionController.isInstanceCheckPowered");
    }),
    createInstance(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.store.createRecord("instancenew", {
            car: currentCar,
            project:null,
            department:null,
            user_name:"",
            oils:[],
            goal:"",
            start_date:null,
            end_date:null,
            creater: currentUser,
            created_date:new Date()
        });
        return instance;
    },
    createTrace(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let lastTrace = instance.get("lastTrace");
        if(!lastTrace){
            Ember.Logger.error(`编号为${instance.get("id")}的申请单出现lastTrace为空的情况：
               可能是申请单没有归档但是其trace被归档了，造成本地没有trace的原因，
               也可能是出现了申请单的IsPending状态为true，但是其所有trace的is_finished都为true的不正常现象。`);
            return null;
        }
        let trace = this.store.createRecord("tracenew", {
            car: currentCar,
            instance:instance,
            previous_trace:lastTrace,
            status:"modified",
            project:lastTrace.get("project"),
            department:lastTrace.get("department"),
            user_name:lastTrace.get("user_name"),
            oils:lastTrace.get("oils"),
            goal:lastTrace.get("goal"),
            start_date:lastTrace.get("start_date"),
            end_date:lastTrace.get("end_date"),
            start_info:'',
            creater: currentUser,
            created_date:new Date()
        });
        return trace;
    },
    createRecapture(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let recapture = this.store.createRecord("tracerecapture", {
            trace:instance.get("lastTrace"),
            instance:instance,
            car: currentCar,
            end_info:"",
            creater: currentUser,
            created_date:new Date()
        });
        return recapture;
    },
    createArchive(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let archive = this.store.createRecord("instancearchive", {
            instance:instance,
            traces:instance.get("traces"),
            car: currentCar,
            creater: currentUser,
            created_date:new Date()
        });
        return archive;
    },
    createCarArchive(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let archive = this.store.createRecord("cararchive", {
            car: currentCar,
            creater: currentUser,
            created_date:(new Date())
        });
        return archive;
    },
    createCarRestore(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let restore = this.store.createRecord("carrestore", {
            car: currentCar,
            creater: currentUser,
            created_date:(new Date())
        });
        return restore;
    },
    createCheck(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let lastTrace = instance.get("lastTrace");
        let status = this.get("isApproved") ? "approved" : "rejected";
        let check = this.store.createRecord("instancecheck", {
            trace:lastTrace,
            car: currentCar,
            instance:instance,
            status:status,
            end_info:this.get("checkText").trim(),
            creater: currentUser,
            created_date:(new Date())
        });
        return check;
    },
    createForbid(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let lastTrace = instance.get("lastTrace");
        let status = "forbidden";
        let forbid = this.store.createRecord("instanceforbid", {
            trace:lastTrace,
            car: currentCar,
            instance:instance,
            status:status,
            start_info:"",
            creater: currentUser,
            created_date:(new Date())
        });
        return forbid;
    },
    createEnable(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let lastTrace = instance.get("lastTrace");
        let status = "enabled";
        let enable = this.store.createRecord("instanceenable", {
            trace:lastTrace,
            car: currentCar,
            instance:instance,
            status:status,
            start_info:"",
            creater: currentUser,
            created_date:(new Date())
        });
        return enable;
    },
    createAbort(){
        let currentUser = this.get("sessionController.user");
        let currentCar = this.get("model");
        let instance = this.get("selection");
        let lastTrace = instance.get("lastTrace");
        let status = "aborted";
        let abort = this.store.createRecord("instanceabort", {
            trace:lastTrace,
            car: currentCar,
            instance:instance,
            status:status,
            start_info:"",
            creater: currentUser,
            created_date:(new Date())
        });
        return abort;
    },
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
        return this.store.peekAll("oil");
    }),
    actions:{
        enterArchivingCar(){
            let archive = this.createCarArchive();
            this.set("archivingCar",archive);
            this.set("isCarArchiving",true);
            this.set("isBaseFolded",false);
        },
        saveArchivingCar(){
            let archivingCar = this.get("archivingCar");
            if(archivingCar){
                archivingCar.save().then(
                    ()=>{
                        this.send("goBack");
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("archivingCar",null);
                this.set("isCarArchiving",false);
            }
        },
        cancelArchivingCar(){
            let archivingCar = this.get("archivingCar");
            this.set("archivingCar",null);
            this.set("isCarArchiving",false);
            this.store.unloadRecord(archivingCar);
        },
        enterRestoreCar(){
            let restore = this.createCarRestore();
            this.set("restoringCar",restore);
            this.set("isCarRestoring",true);
            this.set("isBaseFolded",false);
        },
        saveRestoringCar(){
            let restoringCar = this.get("restoringCar");
            if(restoringCar){
                restoringCar.save().then(
                    ()=>{
                        this.send("goBack");
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("restoringCar",null);
                this.set("isCarRestoring",false);
            }
        },
        cancelRestoringCar(){
            let restoringCar = this.get("restoringCar");
            this.set("restoringCar",null);
            this.set("isCarRestoring",false);
            this.store.unloadRecord(restoringCar);
        },
        enterNewInstance(){
            let instance = this.createInstance();
            this.set("creatingInstance",instance);
            this.set("isCreatingInstance",true);
        },
        saveNewInstance(){
            let creatingInstance = this.get("creatingInstance");
            if(creatingInstance){
                creatingInstance.save().then(
                    ()=>{
                        this.send("goBack");
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("creatingInstance",null);
                this.set("isCreatingInstance",false);
            }
        },
        cancelNewInstance(){
            let creatingInstance = this.get("creatingInstance");
            this.set("creatingInstance",null);
            this.set("isCreatingInstance",false);
            this.store.unloadRecord(creatingInstance);
        },
        createNewTrace(){
            let trace = this.createTrace();
            this.set("creatingTrace",trace);
            this.set("isCreatingTrace",true);
        },
        saveNewTrace(){
            let creatingTrace = this.get("creatingTrace");
            if(creatingTrace){
                creatingTrace.save().then(
                    ()=>{
                        this.store.unloadRecord(creatingTrace);
                        this.set("creatingTrace",null);
                        this.set("isCreatingTrace",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("creatingTrace",null);
                this.set("isCreatingTrace",false);
            }
        },
        cancelCreatingTrace(){
            let creatingTrace = this.get("creatingTrace");
            this.set("creatingTrace",null);
            this.set("isCreatingTrace",false);
            this.store.unloadRecord(creatingTrace);
        },
        recaptureTrace(){
            let recapture = this.createRecapture();
            this.set("recapturingTrace",recapture);
            this.set("isRecapturing",true);
        },
        saveRecapturingTrace(){
            let recapturingTrace = this.get("recapturingTrace");
            if(recapturingTrace){
                recapturingTrace.save().then(
                    ()=>{
                        this.store.unloadRecord(recapturingTrace);
                        this.set("recapturingTrace",null);
                        this.set("isRecapturing",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("recapturingTrace",null);
                this.set("isRecapturing",false);
            }
        },
        cancelRecapturingTrace(){
            let recapturingTrace = this.get("recapturingTrace");
            this.set("recapturingTrace",null);
            this.set("isRecapturing",false);
            this.store.unloadRecord(recapturingTrace);
        },
        archiveInstance(){
            this.notifyPropertyChange("isArchivable");
            let archive = this.createArchive();
            this.set("archivingInstance",archive);
            this.set("isArchiving",true);
        },
        saveArchivingInstance(){
            let archivingInstance = this.get("archivingInstance");
            if(archivingInstance){
                archivingInstance.save().then(
                    ()=>{
                        this.store.unloadRecord(archivingInstance);
                        this.set("archivingInstance",null);
                        this.set("isArchiving",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("archivingInstance",null);
                this.set("isArchiving",false);
            }
        },
        cancelArchivingInstance(){
            let archivingInstance = this.get("archivingInstance");
            this.set("archivingInstance",null);
            this.set("isArchiving",false);
            this.store.unloadRecord(archivingInstance);
        },
        forbidInstance(){
            let forbid = this.createForbid();
            this.set("forbiddingModel",forbid);
            this.set("isForbidding",true);
        },
        saveForbiddingModel(){
            let forbiddingModel = this.get("forbiddingModel");
            if(forbiddingModel){
                forbiddingModel.save().then(
                    ()=>{
                        this.store.unloadRecord(forbiddingModel);
                        this.set("forbiddingModel",null);
                        this.set("isForbidding",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("forbiddingModel",null);
                this.set("isForbidding",false);
            }
        },
        cancelForbidding(){
            let forbiddingModel = this.get("forbiddingModel");
            this.set("forbiddingModel",null);
            this.set("isForbidding",false);
            this.store.unloadRecord(forbiddingModel);
        },
        enableInstance(){
            let enable = this.createEnable();
            this.set("enablingModel",enable);
            this.set("isEnabling",true);
        },
        saveEnablingModel(){
            let enablingModel = this.get("enablingModel");
            if(enablingModel){
                enablingModel.save().then(
                    ()=>{
                        this.store.unloadRecord(enablingModel);
                        this.set("enablingModel",null);
                        this.set("isEnabling",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("enablingModel",null);
                this.set("isEnabling",false);
            }
        },
        cancelEnabling(){
            let enablingModel = this.get("enablingModel");
            this.set("enablingModel",null);
            this.set("isEnabling",false);
            this.store.unloadRecord(enablingModel);
        },
        abortInstance(){
            let abort = this.createAbort();
            this.set("abortingModel",abort);
            this.set("isAborting",true);
        },
        saveAbortingModel(){
            let abortingModel = this.get("abortingModel");
            if(abortingModel){
                abortingModel.save().then(
                    ()=>{
                        this.store.unloadRecord(abortingModel);
                        this.set("abortingModel",null);
                        this.set("isAborting",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("abortingModel",null);
                this.set("isAborting",false);
            }
        },
        cancelAborting(){
            let abortingModel = this.get("abortingModel");
            this.set("abortingModel",null);
            this.set("isAborting",false);
            this.store.unloadRecord(abortingModel);
        },
        checkInstance(){
            if(this.get("isUnCheckable")){
                return;
            }
            let check = this.createCheck();
            this.set("checkingModel",check);
            this.set("isChecking",true);
        },
        saveCheckingModel(){
            let checkingModel = this.get("checkingModel");
            if(checkingModel){
                checkingModel.save().then(
                    ()=>{
                        this.store.unloadRecord(checkingModel);
                        this.set("checkingModel",null);
                        this.set("isChecking",false);
                    }, 
                    ()=>{
                    }
                );
            }
            else{
                this.set("checkingModel",null);
                this.set("isChecking",false);
            }
        },
        cancelChecking(){
            let checkingModel = this.get("checkingModel");
            this.set("checkingModel",null);
            this.set("isChecking",false);
            this.store.unloadRecord(checkingModel);
        },
        setProject(target,project){
            target.set("project",project);
            target.notifyPropertyChange("isRelationshipsChanged");
            this.set("isPickUpPopActive",false);
        },
        setDepartment(target,department){
            target.set("department",department);
            target.notifyPropertyChange("isRelationshipsChanged");
            this.set("isPickUpPopActive",false);
        },
        checkOil({target,value,isChecked}){
            if(isChecked){
                target.get("oils").pushObject(value);
            }
            else{
                target.get("oils").removeObject(value);
            }
            target.notifyPropertyChange("isRelationshipsChanged");
        },
        setProjectForInstance(project){
            let target = this.get("creatingInstance");
            this.send("setProject",target,project);
        },
        setDepartmentForInstance(department){
            let target = this.get("creatingInstance");
            this.send("setDepartment",target,department);
        },
        checkOilForInstance({value,isChecked}){
            let target = this.get("creatingInstance");
            this.send("checkOil",{target,value,isChecked});
        },
        setProjectForTrace(project){
            let target = this.get("creatingTrace");
            this.send("setProject",target,project);
        },
        setDepartmentForTrace(department){
            let target = this.get("creatingTrace");
            this.send("setDepartment",target,department);
        },
        checkOilForTrace({value,isChecked}){
            let target = this.get("creatingTrace");
            this.send("checkOil",{target,value,isChecked});
        },
        fodeInstance(){
            Ember.run.next(()=>{
                this.set("selection",null);
            });
        },
        unfodeInstance(instance){
            this.set("selection",instance);
        },
        setIsApproved(value){
            this.set("isApproved",value);
        }
    }
});
