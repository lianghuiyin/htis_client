import Ember from 'ember';

export default Ember.Controller.extend({
    applicationController:Ember.inject.controller('application'),
    changesetController:Ember.inject.controller('changeset'),
    billController:Ember.inject.controller('start.bill'),
    sessionController:Ember.inject.controller('session'),
    isStartupLoaded:false,//记录是否加载过启动数据，切换用户时不需要重新加载，除非刷新浏览器
    previousTransition:null,
    maxBillLength:20,
    fixScrollBug:function(){
        //当需要在手机上禁用整个网页的滚动条时，开放下面的代码
        //但要增加一些判断，只在e.target=body元素的时候才禁用touchstart事件的默认行为（即滚动）
        // $("body").on("touchstart",function(e){
        //     
        //     console.log("mousemove--");
        //     e.preventDefault();
        //     console.log("mousemove");
        // });
    },
    intervalFun:function(tag,timeout){
    	switch(tag){
    		case 'clear':
    			this.send("clearLocalDataFromStore");
    			break;
    		case 'changeset':
	            this.get("changesetController").send("tryFetch");
    			break;
    	}
	    Ember.run.later(()=>{
	        this.intervalFun(tag,timeout);
	    },timeout);
    },
    actions:{
        retry(){
            this.get("target.router").refresh();
        },
        clearLocalDataFromStore(){
            Ember.debug("clearLocalDataFromStore-------------");
            var store = this.get("store");
            // var isUnloadChipNeeded = false,
            //     isUnloadTraceNeeded = false,
            //     isUnloadInstanceNeeded = false,
            //     isUnloadCarNeeded = false;

            //在changeset没有被暂停的情况下才有必要执行定时清除bill及signature操作
            let changesetController = this.get("changesetController");
            if(!changesetController.get("isPaused")){
                //保留最新maxBillLength个加油单，其他从本地清除
                let bills = store.peekAll("bill");
                let maxId = bills.sortBy("created_date").get("lastObject.id");
                let minId = 0;
                let maxBillLength = this.get("maxBillLength");
                let watchingBillId = this.get("billController.model.id");//排除正在查看的加油单
                if(maxId && maxId > maxBillLength && bills.get("length") > maxBillLength){
                    minId = maxId - maxBillLength + 1;
                    bills.forEach((bill)=>{
                        if(watchingBillId === bill.get("id")){
                            return;
                        }
                        if(bill.get("isNew")){
                            //手机上如果比较卡不学是可能出现isNew为true的情况，所以这里要加判断，以防止正在加油中的单子被删除造成各种莫名问题
                            return;
                        }
                        if(bill.get("id") < minId){
                            store.unloadRecord(bill);
                        }
                    });
                }
                //清除加油单签字，原则是存在加油单就不清除，反之清除
                let signatures = store.peekAll("signature");
                // let tempBill = null;
                let index = -1;
                signatures.forEach((signature)=>{
                    // tempBill = bills.findProperty("signature.id",signature.get("id"));
                    // if(!tempBill && signature.get("isLoaded")){
                    //     store.unloadRecord(signature);
                    // }
                    index = bills.map(function(n){
                        return n.toJSON().signature;
                    }).indexOf(signature.get("id"));
                    if(index < 0){
                        store.unloadRecord(signature);
                    }
                });
            }
        },
        doSchedules(){
            //定期攫取数据库中的数据变化
            Ember.run.later(() => {
            	this.intervalFun('changeset',16000);//16000
            },16000);//14000

            //定期把本地store中无用的数据清除掉以释放内存
            Ember.run.later(() => {
            	this.intervalFun('clear',60000);//30000
            },60000);//30000
        }
    }
});
