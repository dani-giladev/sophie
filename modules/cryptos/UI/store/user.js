Ext.define('App.modules.cryptos.UI.store.user', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptosUser',

    model: 'App.modules.cryptos.UI.model.user',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/user/getAll',
        actionMethods:{
            read: 'GET'
        },        
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
    
});