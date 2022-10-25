Ext.define('App.modules.[MODULE_NAME].UI.store.[MAINTENANCE_NAME]', {
    extend: 'Ext.data.Store',
    alias: 'store.[MODULE_NAME]_[MAINTENANCE_NAME]',

    model: 'App.modules.[MODULE_NAME].UI.model.[MAINTENANCE_NAME]',

    proxy: {
        type: 'ajax',
        endpoint : '[MODULE_NAME]/[MAINTENANCE_NAME]/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
