Ext.define('App.modules.admin.UI.store.user', {
    extend: 'Ext.data.Store',
    alias: 'store.adminUser',

    model: 'App.modules.admin.UI.model.user',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/user/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});