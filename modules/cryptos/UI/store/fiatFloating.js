Ext.define('App.modules.cryptos.UI.store.fiatFloating', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_fiatFloating',

    model: 'App.modules.cryptos.UI.model.fiatFloating',

//    groupField: 'transaction_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/fiatFloating/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    sorters: [{
        property: 'fiat_net_profit_perc',
        direction: 'DESC'
    }]

});
