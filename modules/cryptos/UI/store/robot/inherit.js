Ext.define('App.modules.cryptos.UI.store.robot.inherit', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_inherit',

    model: 'App.modules.cryptos.UI.model.robot.robot',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/robot/getInherits',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
