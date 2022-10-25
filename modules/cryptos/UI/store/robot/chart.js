Ext.define('App.modules.cryptos.UI.store.robot.chart', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_robot_chart',

    model: 'App.modules.cryptos.UI.model.robot.chart',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/robot/getChart',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
