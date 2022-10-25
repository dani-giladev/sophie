Ext.define('App.modules.cryptos.UI.store.reportTransaction', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportTransaction',

    model: 'App.modules.cryptos.UI.model.reportTransaction',

//    groupField: 'transaction_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportTransaction/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
