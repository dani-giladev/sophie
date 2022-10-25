Ext.define('App.modules.cryptos.UI.store.trading.history', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_trading_history',

    model: 'App.modules.cryptos.UI.model.transaction',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/trading/getHistory',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
