Ext.define('App.modules.cryptos.UI.view.symbol.symbol', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-symbol',
    
    requires: [
        'App.modules.cryptos.UI.view.symbol.dynamicFilterForm',
        'App.modules.cryptos.UI.view.symbol.grid',
        'App.modules.cryptos.UI.view.symbol.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'symbol';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.symbol.symbol_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.symbol');
        return controller;
    }

});
