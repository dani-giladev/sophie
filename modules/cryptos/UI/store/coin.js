Ext.define('App.modules.cryptos.UI.store.coin', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_coin',

    model: 'App.modules.cryptos.UI.model.coin',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/symbol/getCoins',
        actionMethods:{
            read: 'GET'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
