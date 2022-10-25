Ext.define('App.modules.cryptos.UI.view.historyRobotChanges.form', {
    extend: 'App.modules.cryptos.UI.view.robot.form',
    alias: 'widget.cryptos-historyRobotChanges-form',
    
    requires: [
        'App.modules.cryptos.UI.view.robot.form'
    ],
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.historyRobotChanges');
        return controller;
    }
        
});
