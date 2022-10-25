Ext.define('App.modules.cryptos.UI.store.reportRobots', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_reportRobots',

    model: 'App.modules.cryptos.UI.model.reportRobots',

    groupField: 'robot_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/reportRobots/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});
