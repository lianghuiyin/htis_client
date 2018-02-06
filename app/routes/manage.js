import Ember from 'ember';

export default Ember.Route.extend({
    activate(){
        let controller = this.controllerFor("manage");
        controller.set("isActive",true);
        return this;
    },
    deactivate(){
        this.send("unloadArchiveds");
        let controller = this.controllerFor("manage");
        controller.set("isActive",false);
        return this;
    },
    actions:{
        didTransition() {
            if(this.controller.get("equipment.isXs")){
                return;
            }
            //当发现没有选项时选中默认的roles
            if(!this.controller.get("selection")){
                this.replaceWith('manage.pendings');
            }
        },
        goHome(){
            this.transitionTo('start');
        },
        goSearchs(){
            this.transitionTo('manage.searchs');
        },
        goPendings(){
            this.transitionTo('manage.pendings');
        },
        goUnuseds(){
            this.transitionTo('manage.unuseds');
        },
        goReleases(){
            this.transitionTo('manage.releases');
        },
        goDisables(){
            this.transitionTo('manage.disables');
        },
        goArchives(){
            this.transitionTo('manage.archives');
        },
        goNew(){
            this.transitionTo('manage.unuseds.new');
        }
    }
});
