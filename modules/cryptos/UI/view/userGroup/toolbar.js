Ext.define('App.modules.cryptos.UI.view.userGroup.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-userGroup-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.userGroup',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.userGroup');
        return controller;
    }

});