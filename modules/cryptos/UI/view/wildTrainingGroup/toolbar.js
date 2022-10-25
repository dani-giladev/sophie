Ext.define('App.modules.cryptos.UI.view.wildTrainingGroup.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-wildTrainingGroup-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.wildTrainingGroup',
        'App.view.maintenance.toolbar'
    ],
    
    show_delete_button: true,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.wildTrainingGroup');
        return controller;
    }

});
