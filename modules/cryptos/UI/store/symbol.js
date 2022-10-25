Ext.define('App.modules.cryptos.UI.store.symbol', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_symbol',

    model: 'App.modules.cryptos.UI.model.symbol',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/symbol/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
