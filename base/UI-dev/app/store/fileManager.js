Ext.define('App.store.fileManager', {
    extend: 'Ext.data.Store',
    alias: 'store.fileManager',
    
    model: 'App.model.fileManager',
    
    proxy: {
        type: 'ajax',
        endpoint : 'admin/fileManager/getFile',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});