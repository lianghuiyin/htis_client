import Ember from 'ember';

export default Ember.Controller.extend({
    applicationController:Ember.inject.controller('application'),
    startupController:Ember.inject.controller('startup'),
    changesetController:Ember.inject.controller('changeset'),
    isLogined: false,
    user: null,
    userId: 0,
    userIdDidChange:Ember.observer("userId",function(){
        //切换用户或者第一次登录需要计算所有申请单的通知消息
        this.send("notifyInstancesMessage");
    }),
    previousTransition: null,
    sharedkey: "horizon2003_htis",
    genrateToken() {
        //生成120秒时长有效token
        let exp = Math.round(new Date().addSeconds(1200).getTime()/1000);
        let sharedkey = this.get("sharedkey");
        let ck = window.CryptoJS.enc.Latin1.parse(sharedkey).toString();
        let powers = this.get("user.role.powers");
        let powerIds = "";
        if(powers){
            powerIds = powers.mapBy("id").join(",");
        }
        let sync = this.get("applicationController.serializedSyncToken");
        let userName = this.get("user.name");
        let userId = this.get("userId");
        let info = Ember.Object.create({
            Exp:exp,
            UserId:userId,
            UserName:userName ? userName : "",
            Powers:powerIds,
            Sync:sync ? sync : "2015-01-01 12:12:12"
        });
        return window.KJUR.jws.JWS.sign(null, '{"alg":"HS256","typ":"JWT"}', JSON.stringify(info), ck);
    },
    decodeToken(token){
      let body = token.split(".")[1];
      if(body){
          let b64 = window.b64utos(body);
          return window.KJUR.jws.JWS.readSafeJSONString(b64);
      }
      else{
        return null;
      }
    },
    checkSession(transition) {
        let isLogined = this.get("isLogined");
        if (!isLogined) {
            this.set("previousTransition", transition);
            transition.send("goLogin");
        }
    },
    isSystemPowered:Ember.computed("user","user.role","user.role.powers","user.isRelationshipsChanged","user.role.isRelationshipsChanged",function(){
        if(this.get("user.isRelationshipsChanged") || this.get("user.role.isRelationshipsChanged")){
            //如果在系统设置中修改了当前用户或者当前用户所属角色的relationship，而没有保存
            //则可以造成权限立即变化，从而造成立即离开系统设置界面
            return true;
        }
        let powers = this.get("user.role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("1");
    }),
    isCarManagePowered:Ember.computed("user","user.role","user.role.powers",function(){
        let powers = this.get("user.role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("2");
    }),
    isInstanceCheckPowered:Ember.computed("user","user.role","user.role.powers",function(){
        let powers = this.get("user.role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("3");
    }),
    isBillScannerPowered:Ember.computed("user","user.role","user.role.powers",function(){
        let powers = this.get("user.role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("4");
    }),
    isBillLosePowered:Ember.computed("user","user.role","user.role.powers",function(){
        let powers = this.get("user.role.powers");
        let powersIds = powers ? powers.mapBy("id") : [];
        return powersIds.contains("5");
    }),
    isManagePowered:Ember.computed("isCarManagePowered","isInstanceCheckPowered",function(){
        return this.get("isCarManagePowered") || this.get("isInstanceCheckPowered");
    }),
    isSignNeeded:Ember.computed("user","user.is_sign_needed",function(){
        return this.get("user.is_sign_needed");
    }),
    isEnableChanged:Ember.observer("user.is_enable","user.hasDirtyAttributes",function(){
        if(this.get("user.hasDirtyAttributes")){
            return;
        }
        let isEnable = this.get("user.is_enable");
        if(!isEnable){
            Ember.run.next(()=>{
                this.send("logout",true);
            });
        }
    }),
    isDeletedChanged:Ember.observer("user.isDeleted",function(){
        Ember.run.next(()=>{
            //这里增加run.next是因为如果删除自己的话，没等提交到后台，就登出系统了
            if(this.get("user.hasDirtyAttributes")){
                return;
            }
            let isDeleted = this.get("user.isDeleted");
            if(isDeleted){
                Ember.run.next(()=>{
                    this.send("logout",true);
                });
            }
        });
    }),
    actions: {
        login(logInfo, isFromLogin) {
            Ember.debug(`login with logId ${logInfo.get("log_id")} and isFromLogin = ${isFromLogin}`);
            this.set("userId", logInfo.get("log_id"));
            this.set("isLogined", true);
            if (isFromLogin) {
                this.send("syncUser");
                this.send("syncLocal", "login", logInfo);
            }
            let previousTransition = this.get("previousTransition");
            let startupController = this.get("startupController");
            if (startupController.get("isStartupLoaded")) {
                Ember.debug(`isStartupLoaded and login`);
                //切换用户需要计算重新所有与isOwn相关的属性
                this.send("notifyIsOwn");
                this.get("changesetController").send('tryFetch');
                if (previousTransition) {
                    this.set("previousTransition", null);
                    previousTransition.retry();
                } else if (isFromLogin) {
                    this.send("goIndex");
                }
            } else {
                this.transitionToRoute("startup");
            }
        },
        logout(isNeedToLogin) {
            this.set("user", null);
            this.set("userId", 0);
            this.set("isLogined", false);
            this.send("syncLocal", "logout");
            if (isNeedToLogin) {
                this.send("goLogin");
            }
        },
        syncUser() {
            if(this.get('user')){
                return;
            }
            let userId = this.get("userId");
            if(userId){
                this.set('user',this.store.peekRecord('user',userId));
            }
        },
        syncLocal(kind, logInfo) {
            if (!window.sessionStorage) {
                return;
            }
            if (!logInfo) {
                logInfo = {};
            }
            switch (kind) {
                case "login":
                    sessionStorage.setItem("user_id", logInfo.get("log_id"));
                    break;
                case "logout":
                    sessionStorage.clear();
                    break;
                case "init":
                    Ember.debug(`syncLocal with the kind 'init'`);
                    //同步sessionStorage中的登录信息
                    let userId = sessionStorage.getItem("user_id");
                    let token = sessionStorage.getItem("token");
                    if (userId && token) {
                        let tokenJson = this.decodeToken(token);
                        if(tokenJson.UserId.toString() === userId){
                            let sync = this.get("applicationController.serializedSyncToken");
                            //登录信息保存48小时
                            if(!sync || window.HOJS.lib.dateDiff("H",tokenJson.Sync,new Date()) < 48){
                                logInfo = Ember.Object.create({
                                    log_id: userId
                                });
                                this.send("login", logInfo);
                            }
                        }
                    }
                    //如果需要在多个窗口中同步session数据则需要定时检查数据变化
                    // setInterval(function(){
                    //     //判断sessionStorage中的数据与sessionController中数据是否一样，如果不一样则同步
                    // }, 3000); 
                    break;
            }
        },
        notifyInstancesMessage(){
            this.store.unloadAll("message");
            //这里加Ember.run是为了提高性能
            Ember.run.next(()=>{
                Ember.run.later(()=>{
                    let isManagePowered = this.get("isManagePowered");
                    if(!isManagePowered){
                        //非车辆管理权限用户没有消息通知
                        return;
                    }
                    //所有没有归档的申请单都要计算通知消息
                    this.store.peekAll("instance").filterBy("is_archived",false).forEach((instance)=>{
                        instance.notifyPropertyChange("messageNotifyTag");
                    });
                },3000);
            });

        },
        notifyIsOwn(){
            //这里加Ember.run是为了提高性能
            Ember.run.next(()=>{
                let isManagePowered = this.get("isManagePowered");
                if(!isManagePowered){
                    //非车辆管理权限用户没有必要计算IsOwn属性值
                    return;
                }
                this.store.peekAll("trace").forEach((trace)=>{
                    trace.notifyPropertyChange("isOwnNotifyTag");
                });
                this.store.peekAll("instance").forEach((instance)=>{
                    instance.notifyPropertyChange("isOwnNotifyTag");
                });
                this.store.peekAll("car").forEach((car)=>{
                    car.notifyPropertyChange("isOwnNotifyTag");
                });
            });
        }
    }
});