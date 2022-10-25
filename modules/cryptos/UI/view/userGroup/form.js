Ext.define('App.modules.cryptos.UI.view.userGroup.form', {
    extend: 'App.view.userGroup.form',
    alias: 'widget.cryptos-userGroup-form',
    
    requires: [

    ],
    
    getSpecialGrants: function()
    {

    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.userGroup');
        return controller;
    }
        
});