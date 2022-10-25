Ext.define('App.modules.admin.UI.store.location', {
    extend: 'Ext.data.Store',
    alias: 'store.adminLocation',

    model: 'App.modules.admin.UI.model.localization',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/localization/getLocations',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});