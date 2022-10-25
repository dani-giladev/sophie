Ext.define('App.modules.cryptos.UI.view.trading.trading', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-trading',
    
    requires: [
        'App.modules.cryptos.UI.controller.trading.trading'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'trading';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.trading.trading);
    },
    
    getWestPanel: function()
    {
        //return Ext.widget('cryptos-trading-filterForm');
        return null;
    },
    
    getCenterPanel: function()
    {
        var me = this;
        
        return {
            xtype: 'panel',
            itemId: 'cryptos-trading-dynamicpanel',
            region: 'center',
            layout: 'vbox',
            scrollable: 'vertical',
            _config: me.config,
            items: [] // Dinamic items     
        };
    },
    
    onRender: function(thisForm, eOpts)
    {
        var me = this;
        
        this.getMaintenanceController().renderView();   
       
        this.callParent(arguments);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }

});
