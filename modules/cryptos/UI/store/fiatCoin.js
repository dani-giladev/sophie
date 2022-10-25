Ext.define('App.modules.cryptos.UI.store.fiatCoin', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_fiatCoin',

    model: 'App.modules.cryptos.UI.model.fiatCoin',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/fiatCoin/getAll',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
