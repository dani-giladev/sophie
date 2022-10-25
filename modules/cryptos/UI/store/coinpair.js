Ext.define('App.modules.cryptos.UI.store.coinpair', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_coinpair',

    model: 'App.modules.cryptos.UI.model.coinpair',

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
