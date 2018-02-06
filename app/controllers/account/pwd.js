// import Ember from 'ember';

// export default Ember.Controller.extend({
// 	isActive:false,
// 	isBack:false,
//     modelTitle:"账户",
//     pannelTitle:"修改密码",
//     helpInfo:"帮助信息",
//     actions:{
//         save(){
//             this.get('model').save().then(()=>{
//                 this.send("goBack");
//             }, ()=>{
//             });
//         },
//         unloadRecord(){
//             let model = this.get("model");
//             model.rollbackAttributes();
//             this.store.unloadRecord(model);
//         }
//     }
// });

import Ember from 'ember';
import NavigablePaneController from '../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"account.pwd",
    modelTitle:"账户",
    pannelTitle:"修改密码",
    helpInfo:"帮助信息",
    actions:{
        save(){
            this.get('model').save().then(()=>{
                this.send("goBack");
            }, ()=>{
            });
        },
        unloadRecord(){
            let model = this.get("model");
            model.rollbackAttributes();
            this.store.unloadRecord(model);
        }
    }
});
