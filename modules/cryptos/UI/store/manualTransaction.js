Ext.define('App.modules.cryptos.UI.store.manualTransaction', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_manualTransaction',

    model: 'App.modules.cryptos.UI.model.manualTransaction',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/manualTransaction/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
