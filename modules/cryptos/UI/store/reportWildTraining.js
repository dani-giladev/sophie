Ext.define('App.modules.cryptos.UI.store.reportWildTraining', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportWildTraining',

    model: 'App.modules.cryptos.UI.model.reportWildTraining',

    groupField: 'training_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportWildTraining/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
