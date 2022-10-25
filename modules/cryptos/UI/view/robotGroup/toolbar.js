Ext.define('App.modules.cryptos.UI.view.robotGroup.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-robotGroup-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.robotGroup',
        'App.view.maintenance.toolbar'
    ],
    
    show_delete_button: true,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robotGroup');
        return controller;
    }

});
