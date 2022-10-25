Ext.define('App.modules.admin.UI.store.country', {
    extend: 'Ext.data.Store',
    alias: 'store.adminCountry',

    model: 'App.modules.admin.UI.model.localization',

    proxy: {
        type: 'ajax',
        endpoint : 'admin/localization/getCountries',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});