Ext.define('App.modules.cryptos.UI.store.robot.robot', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_robot',

    model: 'App.modules.cryptos.UI.model.robot.robot',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/robot/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
