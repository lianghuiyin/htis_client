import Ember from 'ember';

export default Ember.Controller.extend({
    sessionController:Ember.inject.controller('session'),
    equipment: Ember.inject.service('equipment'),
    isPaused:false,
    errorCount:0,
    isNeedToShowError:false,
    lastErrorToken:null,//记录最后一次请求changeset错误的时间，当其变化时重新攫取changeset
    lastErrorTokenDidChange:Ember.observer("lastErrorToken",function(){
        this.send("tryFetch");
    }),
    billsForPrint:[],
    afterChangesetFetched(isSuccess){
        // let sessionController = this.get("sessionController");
        // sessionController.send('syncUser');
        if(isSuccess){
            this.set("isNeedToShowError",false);
            this.set("errorCount",0);
            this.send("checkPrintedBillAndRing");
        }
        else{
            let errorCount = this.get("errorCount");
            this.set("errorCount",++errorCount);
            if(errorCount > 1){
                //提示网络数据同步失败
                this.set("isNeedToShowError",true);
            }
        }
        var store = this.store;
        store.unloadAll("changeset");
        if(!this.get("equipment.isXs")){
            //这里加run.next为提高性能
            Ember.run.next(()=>{
                //手机上性能问题，所以不计算过期状态
                this.send("computeInstanceIsFinished");
            });
        }
    },
    actions:{
        tryFetch(){
            let isPaused = this.get("isPaused");
            if(isPaused){
                return;
            }
            Ember.debug(`changesetController.tryFetch`);
            let sessionController = this.get("sessionController");
            if(!sessionController.get("isLogined")){
                return;
            }
            let prom = this.store.createRecord("changeset").save();
            prom.then((answer)=>{
                this.afterChangesetFetched(true,answer.get("user"));
            }, ()=>{
                this.afterChangesetFetched(false);
            });
            return prom;
        },
        computeInstanceIsFinished(){
            //通知instance计算过期状态
            //只需要通知可加油、已启用且没有过期的申请单重新计算
            let instances = this.store.peekAll("instance").filter((item)=>{
                return !item.get("is_archived") && item.get("is_released") && item.get("is_enable") && !item.get("isFinished");
            });
            instances.forEach((item)=>{
                item.notifyPropertyChange("isFinished");
            });
        },
        checkPrintedBillAndRing(){
            //把新打印出来的单子找出来并发出声音提示
            let billsForPrint = this.get("billsForPrint");
            let store = this.store;
            let hasPrintedBills = [];
            let tempBill;
            billsForPrint.forEach(function(n){
                tempBill = store.peekRecord("bill",n);
                if(tempBill && tempBill.get("is_printed")){
                    hasPrintedBills.pushObject(n);
                }
            });
            if(hasPrintedBills.length){
                this.send("playMusicTimes",window.$("audio")[0],hasPrintedBills.length);
                billsForPrint.removeObjects(hasPrintedBills);
            }
        },
        playMusicTimes(player,times){
            let count = 0;
            player.play();
            player.addEventListener("ended",function() {
                count++;
                if(count < times){
                    player.play();
                }
            });
        }
    }
});
