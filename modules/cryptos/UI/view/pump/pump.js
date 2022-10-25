Ext.define('App.modules.cryptos.UI.view.pump.pump', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-pump',
    
    requires: [
        'App.modules.cryptos.UI.view.pump.dynamicFilterForm',
        'App.modules.cryptos.UI.view.pump.grid',
        'App.modules.cryptos.UI.view.pump.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'pump';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.pump.pump_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.pump');
        return controller;
    }

});
