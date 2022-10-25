Ext.define('App.modules.cryptos.UI.store.userGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptosUserGroup',

    model: 'App.modules.cryptos.UI.model.userGroup',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/userGroup/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});