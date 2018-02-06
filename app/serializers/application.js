import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({//ActiveModelSerializer/RESTSerializer
    primaryKey:'Id',
    isNewSerializerAPI:true,
    attrs:{
        server_side_error:'ServerSideError',
        is_changeset_error:'IsChangesetError',
        err_msg_for_changeset:'ErrMsgForChangeset'
    },
    normalizeResponse: function (store, primaryModelClass, payload, id, requestType) {
        let sync_token = null;
        if(payload.IsChangesetError){
            this.extractChangesetError(payload.ErrMsgForChangeset);
        }
        delete payload.IsChangesetError;
        delete payload.ErrMsgForChangeset;
        if(payload.Startup){
            var serializedStartup = {};
            for(let k in payload.Startup){
                serializedStartup[Ember.String.underscore(k)] = payload.Startup[k];
            }
            sync_token = serializedStartup.sync_token;
            delete serializedStartup.id;
            delete serializedStartup.sync_token;
            this.extractStartup(store,serializedStartup);
        }
        else if(payload.Changeset){
            var serializedChangeset = {};
            for(let k in payload.Changeset){
                serializedChangeset[Ember.String.underscore(k)] = payload.Changeset[k];
            }
            sync_token = serializedChangeset.sync_token;
            delete serializedChangeset.id;
            delete serializedChangeset.sync_token;
            let capitalizedModelName = primaryModelClass.modelName.capitalize();
            this.extractChangeset(
                store,
                serializedChangeset,
                primaryModelClass.modelName,
                payload[capitalizedModelName] ? payload[capitalizedModelName]["Id"] : null
            );

            // var serializedChangeset = {};
            // for(let k in payload.Changeset){
            //     serializedChangeset[Ember.String.underscore(k)] = payload.Changeset[k];
            // }
            // sync_token = serializedChangeset.sync_token;
            // delete serializedChangeset.sync_token;
            // this.extractChangeset(
            //     store,
            //     serializedChangeset,
            //     type.typeKey,
            //     payload[type.typeKey] ? payload[type.typeKey]["Id"] : null
            // );
        }
        if(sync_token){
            this.extractSyncToken(store, sync_token);
        }
        return this._super(store, primaryModelClass, payload, id, requestType);
    },
    serialize: function(record, options) {
        return this._super(record, options);
    },
    keyForAttribute: function(attr) {
        return Ember.String.classify(attr);
    },
    keyForRelationship: function(attr) {
        return Ember.String.classify(attr);
    },
    extractMeta: function(store, type, payload) {
        if(payload&&payload.meta){
            var serializedMeta = {};
            for(var k in payload.meta){
                serializedMeta[Ember.String.underscore(k)] = payload.meta[k];
            }
            store.setMetadataFor(type,serializedMeta);
            delete payload.meta;
        }
    },
    // extract:function(store, type, payload, id, requestType){
    //     let sync_token = null;
    //     if(payload.IsChangesetError){
    //         this.extractChangesetError(payload.ErrMsgForChangeset);
    //     }
    //     delete payload.IsChangesetError;
    //     delete payload.ErrMsgForChangeset;
    //     if(payload.Startup){
    //         var serializedStartup = {};
    //         for(let k in payload.Startup){
    //             serializedStartup[Ember.String.underscore(k)] = payload.Startup[k];
    //         }
    //         sync_token = serializedStartup.sync_token;
    //         delete serializedStartup.sync_token;
    //         this.extractStartup(store,serializedStartup);
    //     }
    //     else if(payload.Changeset){
    //         var serializedChangeset = {};
    //         for(let k in payload.Changeset){
    //             serializedChangeset[Ember.String.underscore(k)] = payload.Changeset[k];
    //         }
    //         sync_token = serializedChangeset.sync_token;
    //         delete serializedChangeset.sync_token;
    //         this.extractChangeset(
    //             store,
    //             serializedChangeset,
    //             type.typeKey,
    //             payload[type.typeKey] ? payload[type.typeKey]["Id"] : null
    //         );
    //     }
    //     else if(payload.search){
    //         var serializedSearch = {};
    //         for(let k in payload.search){
    //             serializedSearch[Ember.String.underscore(k)] = payload.search[k];
    //         }
    //         delete serializedSearch.user;
    //         this.extractSearch(store,serializedSearch);
    //     }
    //     if(sync_token){
    //         this.extractSyncToken(store, sync_token);
    //     }
    //     return this._super(store, type, payload, id, requestType);
    // },
    extractChangesetError:function(errMsg){
        Ember.error("There is an error for changeset fetching:%@".fmt(errMsg));
        this.container.lookup('controller:changeset').set("lastErrorToken",new Date());
    },
    extractStartup:function(store,startup){
        store.pushPayload(startup);
        // let instances = startup.instances;
        // let traces = startup.traces;
        // delete startup.instances;
        // delete startup.traces;
        // startup.traces = [];
        // startup.instances = [];
        // store.pushPayload(startup);
        // Ember.run.next(()=>{
        //     store.pushPayload({
        //         instances:instances
        //     });
        //     Ember.run.next(()=>{
        //         store.pushPayload({
        //             traces:traces
        //         });
        //     });
        // });
    },
    // extractArray:function(e,r,t){
    //     var i=this.normalizePayload(t);
    //     var n=r.typeKey;
    //     var a;
    //     for(var o in i){
    //         var s=o;
    //         var u=false;
    //         if(o.charAt(0)==="_"){
    //             u=true;s=o.substr(1)
    //         }
    //         var c=this.typeForRoot(s);
    //         if(!e.modelFactoryFor(c)){
    //             continue
    //         }
    //         var l=e.modelFor(c);
    //         var d=e.serializerFor(l);
    //         var h=!u&&l.typeKey===n;
    //         var f=Q.call(i[o],function(e){
    //             return d.normalize(l,e,o)
    //         },this);
    //         if(h){
    //             a=f
    //         }else{
    //             e.pushMany(c,f)
    //         }}
    //         return a
    // },
    extractChangeset:function(store,changeset,currentTypeKey,currentId){
        //为防止新添加的记录可能依赖已删除的记录造成的潜在问题
        //一定要先加载添加和修改的记录，然后再加载删除的记录
        // var deleteds = changeset.deleteds;
        // var serializedDeleteds = this.extractArray(store,Hwv.Deleted,changeset.deleteds);
        var deleteds = [];
        if(changeset.deleteds){
            deleteds = Ember.copy(changeset.deleteds,true);
        }
        // for(var k in deleteds){
        //     serializedDeleteds[Ember.String.underscore(k)] = deleteds[k];
        // }
        delete changeset.deleteds;
        //因为添加或修改一条记录后，后台会同时返回change及当前记录
        //当前记录如果在changeset中存在，则需要删除掉，除了优化性能外
        //更重要的是在新增记录时，如果不删除重复项的话，会出现新增了两次记录的问题
        var currentObjsByType = changeset[Ember.String.pluralize(currentTypeKey)];
        if(currentObjsByType){
            var currentObj = currentObjsByType.findBy("Id",currentId);
            if(currentObj){
                currentObjsByType.removeObject(currentObj);
            }
        }
        //根据modified_date值是否有变化判断是否记录已更新到store中，清除changeset中的重复项
        for(var key in changeset){
            var singularizeKey = key.singularize();
            var records = changeset[key];
            var tempId,tempRecord,tempModifiedDate;
            if(records.length > 0){
                changeset[key] = records.filter((record)=>{
                    tempId = record["Id"];
                    tempRecord = store.peekRecord(singularizeKey,tempId);
                    if(tempRecord){
                        //如果本地存在相同记录，则对比其ModifiedDate属性时间来判断数据是否有变化，从而判断是否需要跳过该记录
                        tempModifiedDate = record["ModifiedDate"];
                        let equalTag = "modified_date";
                        if(!tempModifiedDate){
                            equalTag = "created_date";
                            tempModifiedDate = record["CreatedDate"];
                        }
                        tempModifiedDate = store.container.lookup("transform:date").deserialize.call(null,tempModifiedDate);
                        if(tempModifiedDate.getTime() === tempRecord.get(equalTag).getTime()){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    else{
                        return true;
                    }
                });
            }
        }
        store.pushPayload(changeset);//添加和修改的记录直接覆盖加载即可
        //加载删除的记录，从store中unloadRecord
        //这里要加run.next是因为不加的话，会报错，需要先unloadchangeset再执行这边的unloadRecord
        Ember.run.next(()=>{
            deleteds.forEach(function(deleted){
                var model = Ember.String.underscore(deleted["Model"]),
                    targetIds = deleted["TargetIds"].split(",");
                targetIds.forEach(function(id){
                    var record = store.peekRecord(model,id);
                    if(record){
                        store.unloadRecord(record);
                    }
                });
            });
        });
    },
    extractSyncToken:function(store,sync_token){
        this.container.lookup("controller:application").set("syncToken",this.container.lookup("transform:date").deserialize.call(null,sync_token));
    },
    extractSearch:function(store,search){
        store.pushPayload(search);
    }
    // pushPayload:function(store, payload){
    //     var data=this.normalizePayload(payload);
    //     for(var prop in data){
    //         var type=this.typeForRoot(prop);
    //         if(!store.modelFactoryFor(type,prop)){
    //             continue
    //         }
    //         var model=store.modelFor(type);
    //         var serializer=store.serializerFor(model);
    //         var normalizeDatas = Ember.makeArray(data[prop]).map(function(item){
    //             return serializer.normalize(model,item,prop)
    //         },this);
    //         store.pushMany(type,normalizeDatas)
    //     }
    // }
});