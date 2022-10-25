Ext.define('App.modules.cryptos.UI.store.floating', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_floating',

    model: 'App.modules.cryptos.UI.model.floating',

    groupField: 'transaction_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/floating/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
