Ext.define('App.modules.cryptos.UI.store.reportProfit', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportProfit',

    model: 'App.modules.cryptos.UI.model.reportProfit',

//    groupField: 'balance_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportProfit/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
