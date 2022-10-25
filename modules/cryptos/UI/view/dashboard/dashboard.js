Ext.define('App.modules.cryptos.UI.view.dashboard.dashboard', {
    extend: 'App.view.dashboard.dashboard',
    xtype: 'cryptos-dashboard',
    
    requires: [
        'App.modules.cryptos.UI.controller.dashboard',
        'App.modules.cryptos.UI.view.dashboard.toolbar',
        'App.modules.cryptos.UI.view.dashboard.centerpanel'
    ],

    initComponent: function()
    {
        var me = this;

        me.config.moduleId = 'cryptos';
        me.config.modelId = 'dashboard';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.dashboard.dashboard);
    },
    
    onRender: function(grid, options, norefresh)
    {
        var me = this; 
        
        if (!me.getDashboardController().getUIData().is_devel)
        {
            me.getDashboardController().refresh(me.config); 
        }
        
        this.callParent(arguments);
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});