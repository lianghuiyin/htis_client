// import Ember from 'ember';

// export default Ember.Route.extend({
//     beforeModel(transition){
//         var sessionController = this.controllerFor("session");
//         return sessionController.checkSession(transition);
//     },
//     model(){
//         return this.controllerFor("session").get("user");
//     },
//     activate(){
//         let controller = this.controllerFor("account");
//         if(Ember.$.support.transition){
//             Ember.run.next(()=>{
//                 //这里要加later的原因是有时next执行得太快没有动画效果
//                 // Ember.run.later(()=>{
//                     controller.set("isActive",true);
//                 // },100);
//             });
//         }
//         else{
//             controller.set("isActive",true);
//         }
//         return this;
//     },
//     deactivate(){
//         let controller = this.controllerFor("account");
//         controller.set("isActive",false);
//         return this;
//     },
//     actions:{
//         goAccountInfo(){
//             this.transitionTo('account.info');
//         },
//         goAccountPwd(){
//             this.transitionTo('account.pwd');
//         },
//         goBack(){
//             this.transitionTo('index');
//         }
//     }
// });


import Ember from 'ember';
import NavigablePaneRoute from '../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
    controllerName: 'account',
    parentControllerName:"",
    beforeModel(transition){
        var sessionController = this.controllerFor("session");
        return sessionController.checkSession(transition);
    },
    model(){
        return this.controllerFor("session").get("user");
    },
    actions:{
        goAccountInfo(){
            this.transitionTo('account.info');
        },
        goAccountPwd(){
            this.transitionTo('account.pwd');
        },
        goBack(){
            this.transitionTo('index');
        }
    }
});

