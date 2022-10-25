Ext.define('App.modules.cryptos.UI.store.historyRobotChanges', {
    extend: 'Ext.data.Store',
    alias: 'store.cryptos_historyRobotChanges',

    model: 'App.modules.cryptos.UI.model.historyRobotChanges',

    groupField: 'history_robot_changes_grouping',

    proxy: {
        type: 'ajax',
        endpoint : 'cryptos/historyRobotChanges/getFiltered',
        actionMethods:{
            read: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    sorters: [{
        property: 'last_modification_date',
        direction: 'DESC'
    }]

});
