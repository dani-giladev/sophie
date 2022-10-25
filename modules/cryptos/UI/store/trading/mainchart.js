Ext.define('App.modules.cryptos.UI.store.trading.mainchart', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_trading_mainchart',

    model: 'App.modules.cryptos.UI.model.trading.mainchart',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/trading/getMainChartData',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
