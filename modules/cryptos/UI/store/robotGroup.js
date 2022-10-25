Ext.define('App.modules.cryptos.UI.store.robotGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_robotGroup',

    model: 'App.modules.cryptos.UI.model.robotGroup',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/robotGroup/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
