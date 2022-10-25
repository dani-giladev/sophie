Ext.define('App.modules.cryptos.UI.store.reportTraining', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportTraining',

    model: 'App.modules.cryptos.UI.model.reportTraining',

    groupField: 'training_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportTraining/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
