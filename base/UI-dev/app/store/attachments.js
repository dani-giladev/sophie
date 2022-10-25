Ext.define('App.store.attachments', {
    extend: 'Ext.data.Store',
    alias: 'store.attachments',

    model: 'App.model.attachments',
    
    proxy: {
        type: 'ajax',
        endpoint : 'admin/attachments/getAttachments',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});