Ext.define('App.modules.cryptos.UI.view.reportRobots.form', {
    extend: 'App.modules.cryptos.UI.view.robot.form',
    alias: 'widget.cryptos-reportRobots-form',
    
    requires: [
        'App.modules.cryptos.UI.view.robot.form'
    ],
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportRobots');
        return controller;
    }
        
});
