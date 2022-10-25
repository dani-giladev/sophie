Ext.define('App.modules.admin.UI.store.province', {
    extend: 'Ext.data.Store',
    alias: 'store.adminProvince',

    model: 'App.modules.admin.UI.model.localization',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/localization/getProvinces',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});