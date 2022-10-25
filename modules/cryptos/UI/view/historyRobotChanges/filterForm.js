Ext.define('App.modules.cryptos.UI.view.historyRobotChanges.filterForm', {
    extend: 'App.modules.cryptos.UI.view.reportTraining.filterForm',
    alias: 'widget.cryptos-historyRobotChanges-filterform',
    
    requires: [
        'App.modules.cryptos.UI.view.reportTraining.filterForm'
    ],
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.historyRobotChanges');
        return controller;
    }

});