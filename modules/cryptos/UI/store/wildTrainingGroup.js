Ext.define('App.modules.cryptos.UI.store.wildTrainingGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_wildTrainingGroup',

    model: 'App.modules.cryptos.UI.model.wildTrainingGroup',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/wildTrainingGroup/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
