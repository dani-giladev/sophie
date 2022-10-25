Ext.define('App.modules.cryptos.UI.store.reportFiatProfit', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportFiatProfit',

    model: 'App.modules.cryptos.UI.model.reportFiatProfit',

//    groupField: 'balance_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportFiatProfit/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
