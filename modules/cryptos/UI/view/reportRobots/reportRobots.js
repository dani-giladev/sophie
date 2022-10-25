Ext.define('App.modules.cryptos.UI.view.reportRobots.reportRobots', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportRobots',
    
    requires: [
        'App.modules.cryptos.UI.view.reportRobots.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportRobots.grid',
        'App.modules.cryptos.UI.view.reportRobots.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportRobots';
        
        me.config.extraParams = {
            get_charts: true
        };

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.reportRobots.robots);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportRobots');
        return controller;
    }

});
