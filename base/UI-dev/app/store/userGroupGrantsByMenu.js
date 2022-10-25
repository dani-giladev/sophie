Ext.define('App.store.userGroupGrantsByMenu', {
    extend: 'Ext.data.Store',
    alias: 'store.userGroupGrantsByMenu',

    model: 'App.model.userGroupGrantsByMenu',

    proxy: {
        type: 'ajax',
        actionMethods:{
            read: 'POST'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data',
            idProperty: 'id'
        }
    }
    
});