Ext.define('App.modules.cryptos.UI.view.wildTrainingGroup.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-wildTrainingGroup-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.wildTrainingGroup',
        'App.modules.cryptos.UI.store.wildTrainingGroup',
        'App.modules.cryptos.UI.model.wildTrainingGroup'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.wildTrainingGroup');
        return controller;
    }
});
