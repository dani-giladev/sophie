Ext.define('App.modules.cryptos.UI.view.robot.robot', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-robot',
    
    requires: [
        'App.modules.cryptos.UI.view.robot.dynamicFilterForm',
        'App.modules.cryptos.UI.view.robot.grid',
        'App.modules.cryptos.UI.view.robot.toolbar',
        'App.modules.cryptos.UI.view.robot.settingPricesCharts'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'robot';
        
        me.config.extraParams = {
            get_funds: true,
            get_charts: true
        };

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.robot.robot_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }

});
