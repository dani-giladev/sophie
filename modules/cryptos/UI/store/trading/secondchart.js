Ext.define('App.modules.cryptos.UI.store.trading.secondchart', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_trading_secondchart',

    model: 'App.modules.cryptos.UI.model.trading.secondchart',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/trading/getSecondChartData',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
