Ext.define('App.modules.admin.UI.store.plugin', {
    extend: 'Ext.data.Store',
    alias: 'store.adminPlugin',

    model: 'App.modules.admin.UI.model.plugin',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/plugin/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});