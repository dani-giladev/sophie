Ext.define('App.modules.cryptos.UI.view.reportWildTraining.filterForm', {
    extend: 'App.modules.cryptos.UI.view.reportTraining.filterForm',
    alias: 'widget.cryptos-reportWildTraining-filterform',
    
    requires: [
        'App.modules.cryptos.UI.view.reportTraining.filterForm'
    ],
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportWildTraining');
        return controller;
    }

});