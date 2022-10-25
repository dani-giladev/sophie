Ext.define('App.modules.cryptos.UI.store.pump', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_pump',

    model: 'App.modules.cryptos.UI.model.pump',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/pump/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    sorters: [{
        property: 'creation_date',
        direction: 'DESC'
    }]

});
