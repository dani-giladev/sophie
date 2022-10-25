Ext.define('App.store.config', {
    extend: 'Ext.data.Store',
    alias: 'store.config',

    model: 'App.model.config',
    
    proxy: {
        type: 'ajax',
        endpoint : 'admin/config/getParams',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});