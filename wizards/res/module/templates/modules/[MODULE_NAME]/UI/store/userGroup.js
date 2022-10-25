Ext.define('App.modules.[MODULE_NAME].UI.store.userGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.[MODULE_NAME]UserGroup',

    model: 'App.modules.[MODULE_NAME].UI.model.userGroup',

    proxy: {
        type: 'ajax',
        endpoint : '[MODULE_NAME]/userGroup/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});