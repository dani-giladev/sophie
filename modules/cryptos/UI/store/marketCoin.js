Ext.define('App.modules.cryptos.UI.store.marketCoin', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_marketCoin',

    model: 'App.modules.cryptos.UI.model.marketCoin',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/marketCoin/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
