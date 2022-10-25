Ext.define('App.modules.admin.UI.store.userGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.adminUserGroup',

    model: 'App.modules.admin.UI.model.userGroup',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/userGroup/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});