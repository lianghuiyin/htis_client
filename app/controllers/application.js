import Ember from 'ember';

export default Ember.Controller.extend({
    equipment: Ember.inject.service('equipment'),
    changesetController:Ember.inject.controller('changeset'),
	init(){
		Ember.$(window).on("resize",()=>{
			this.get("equipment").notifyPropertyChange("isXs");
		});
	},
	appName: 'Horizon Tanker Information System.',
	appTitle:"上汽大众加油机信息系统",
	firmName:"上汽大众",
	appShortTitle:"加油机信息系统",
	author:"上海好耐电子科技有限公司 M&T HORIZON",
	authorSite:"http://www.mthorizon.com/",
	copyright:"版权所有 Copyright 2016",
	version:"当前版本：V1.2.9",
	currentUser:null,
    syncToken:null,
    serializedSyncToken:null,//反序列化syncToken值，用于把syncToken值提交给服务器
    syncTokenDidChange:Ember.observer("syncToken",function(){
        let syncToken = this.get("syncToken");
        if(syncToken){
            let delayedSyncToken = Ember.copy(syncToken);
            let serializeSyncToken = this.container.lookup("transform:date").serialize.call(null,delayedSyncToken);
            //因为每次服务器接收请求更改数据到更改完成存在一个时间过程，比如慢的多表级联操作存储过程执行可能需要好几秒时间
            //这样会造成数据库中每条记录的ModifiedDate属性值存在延时误差，为了兼顾这种误差
            //在实际抓取changeset时，根据syncToken值提前20秒(一个修改请求应该不会超过20秒)
            //这样虽然会多抓取20秒内的数据造成一定的性能损失，但可以最大程度保证changeset不漏抓
            //把前后台时间误差的bug解决后就不需要这个逻辑了
            // delayedSyncToken.addSeconds(-20);
            this.set("serializedSyncToken",serializeSyncToken);
        }
    }),
    isAboutActive:false,
    isBellActive:false,
    remoteDebugStatus:"none",
    remoteDebugUrl:"http://192.168.0.158:8080",
    remoteDebugList:[{
        name:'关闭',
        value:'none'
    },{
        name:'Weinre',
        value:'weinre'
    },{
        name:'Debuggap',
        value:'debuggap'
    }],
    isWeinreDebugging:Ember.computed("remoteDebugStatus",function(){
        return this.get("remoteDebugStatus") === "weinre";
    }),
    isDebuggapDebugging:Ember.computed("remoteDebugStatus",function(){
        return this.get("remoteDebugStatus") === "debuggap";
    }),
    remoteDebugUrlDidChange:Ember.observer("remoteDebugStatus",function(){
        //增加weinre/debuggap远程调度功能
        let remoteDebugUrl = this.get("remoteDebugUrl");
        let isDebugStarted = window.$("weinrehighlighter").length > 0 || window.$("#debuggapRoot").length > 0;
        let isWeinreDebugging = this.get("isWeinreDebugging");
        let isDebuggapDebugging = this.get("isDebuggapDebugging");
        if((isWeinreDebugging || isDebuggapDebugging) && !isDebugStarted){
            let sc = document.createElement("script");
            sc.setAttribute("name","remote-dabug");
            let url = "";
            if(isWeinreDebugging){
                url = `${remoteDebugUrl}/target/target-script-min.js#anonymous`;
            }
            else{
                url = `debuggap.js`;
            }
            sc.setAttribute("src",url);
            document.getElementsByTagName("body")[0].appendChild(sc);
        }
        else{
            window.$("script[name='remote-dabug']").remove();
        }
    }),
    isSideActive:Ember.computed("isAboutActive","isBellActive",function(){
        return this.get("isBellActive") || this.get("isAboutActive");
    }),
    preferences:Ember.computed(function(){
        return this.store.peekAll("preference");
    }),
    shortcutHour:Ember.computed("preferences.firstObject.shortcut_hour",function(){
        return this.get("preferences.firstObject.shortcut_hour");
    }),
    finishHour:Ember.computed("preferences.firstObject.finish_hour",function(){
        return this.get("preferences.firstObject.finish_hour");
    })
});
