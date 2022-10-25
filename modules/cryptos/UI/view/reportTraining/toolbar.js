Ext.define('App.modules.cryptos.UI.view.reportTraining.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-reportTraining-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTraining',
        'App.view.maintenance.toolbar'
    ],
    
    show_add_button: false,
    show_edit_button: false,
//    show_delete_button: false,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTraining');
        return controller;
    }

});
