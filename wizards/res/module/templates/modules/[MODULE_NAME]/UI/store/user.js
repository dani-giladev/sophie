Ext.define('App.modules.[MODULE_NAME].UI.store.user', {
    extend: 'Ext.data.Store',
    alias: 'store.[MODULE_NAME]User',

    model: 'App.modules.[MODULE_NAME].UI.model.user',

    proxy: {
        type: 'ajax',
        endpoint : '[MODULE_NAME]/user/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});