Ext.define('App.modules.admin.UI.store.maintenance', {
    extend: 'Ext.data.Store',
    alias: 'store.adminMaintenance',

    model: 'App.modules.admin.UI.model.maintenance',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/plugin/getAllMaintenance',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});