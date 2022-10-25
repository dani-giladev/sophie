Ext.define('App.modules.cryptos.UI.store.reportProfitChart', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportProfitChart',

    model: 'App.modules.cryptos.UI.model.reportProfitChart',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportProfit/getBalanceChart',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
